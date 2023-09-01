import { Request, RequestHandler, Response, Router } from "express";
import { BmatchMiningServices } from "shared/services/bmatch-mining-service";
import { BmatchScrappingServices } from "shared/services/bmatch-scrapping-service";
import { GoogleChatMessageService } from "shared/services/google-chat-message-service";
import ServiceConnectionController from "../controllers/service-connections";

export default function serviceConnectionsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: ServiceConnectionController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();
  const googleChatService = new GoogleChatMessageService({
    key: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_KEY as string,
    token: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_TOKEN as string,
  });

  router.post(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const serviceConnection = await controller.createServiceConnection(
          request.body
        );
        await googleChatService.createNewServiceConnectionMessage({
          userId: serviceConnection.userId,
          serviceConnectionId: serviceConnection.id,
          serviceName:
            serviceConnection.serviceKey ?? "<Servicio no conectado>",
        });
        response.status(200).json(serviceConnection);
      } catch (error) {
        response
          .status(500)
          .json({ message: "Error creating service connection" });
      }
    }
  );

  router.get(
    "/:serviceId/initialize",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { serviceId } = request.params;
      const { log } = request;
      //eliminar if (request.body.alias === "error") y else
      const serviceConnection = await controller.getById(serviceId);

      try {
        if (serviceConnection.alias === "error") {
          throw new Error("Forced Error");
        }
        if (serviceConnection.serviceKey) {
          const scrapService = new BmatchScrappingServices({
            url: process.env.SCRAPPER_API_URL as string,
          });

          const miningRequests = await scrapService.scrap({
            serviceKey: serviceConnection.serviceKey,
            serviceConnectionId: serviceConnection.id,
          });

          if (miningRequests.length === 0)
            throw new Error("No mining requests");
          const miningService = new BmatchMiningServices({
            url: process.env.MINER_API_URL as string,
          });

          const miningResults = await Promise.all(
            miningRequests.map((req) => {
              return miningService.mine(req);
            })
          );

          await controller.activateServiceConnection(serviceConnection.id);
          await googleChatService.updateServiceConnectionMessage({
            userId: serviceConnection.userId,
            serviceConnectionId: serviceConnection.id,
            serviceName: serviceConnection.serviceKey,
            config: serviceConnection.config,
            source: "app",
            result: "success",
          });
          return response.status(200).json(miningResults);
        }
        const serviceReadings = await controller.initializeServiceConnection(
          request,
          serviceId
        );
        response.status(200).json(serviceReadings);
      } catch (error) {
        log.error(error);
        await googleChatService.updateServiceConnectionMessage({
          userId: serviceConnection.userId,
          serviceConnectionId: serviceConnection.id,
          serviceName:
            serviceConnection.serviceKey ?? "<Servicio no conectado>",
          config: serviceConnection.config,
          source: "app",
          result: "error",
        });
        return response
          .status(500)
          .json({ message: "Error creando la inicializando al servicio." });
      }
    }
  );
  router.get(
    "/:serviceId/refresh",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { serviceId } = request.params;
      const serviceConnection = await controller.getById(serviceId);
      if (serviceConnection.serviceKey) {
        const scrapService = new BmatchScrappingServices({
          url: process.env.SCRAPPER_API_URL as string,
        });
        const miningRequests = await scrapService.scrap({
          serviceKey: serviceConnection.serviceKey,
          serviceConnectionId: serviceConnection.id,
        });

        if (miningRequests) {
          const miningService = new BmatchMiningServices({
            url: process.env.MINER_API_URL as string,
          });
          const miningResults = await Promise.all(
            miningRequests.map((req) => {
              return miningService.mine(req);
            })
          );
          await controller.activateServiceConnection(serviceConnection.id);
          return response.status(200).json(miningResults);
        }
      } else {
        return response
          .status(500)
          .json({ message: "Error actualizando los datos del servicio" });
      }
    }
  );

  router.get(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      // todo: domain error
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const serviceConnections =
          await controller.getServiceConnectionsDetailed(request);
        response.status(200).json(serviceConnections);
      } catch (error) {
        // todo : domain error
        response
          .status(500)
          .json({ message: "Error fetching service connections detailed" });
      }
    }
  );
  
  router.get(
    "/me/chat",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      // todo: domain error
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const serviceConnections =
          await controller.getServiceConnectionsDetailedChat(request);
        response.status(200).json(serviceConnections);
      } catch (error) {
        // todo : domain error
        response
          .status(500)
          .json({ message: "Error fetching service connections detailed" });
      }
    }
  );

  router.get(
    "/:id",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const { id } = request.params;
        const serviceConnection = await controller.getById(id);
        response.status(200).json(serviceConnection);
      } catch (error) {
        response
          .status(500)
          .json({ message: "Error fetching service connection" });
      }
    }
  );
  router.get(
    "/usages/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const userUsages = await controller.getUsagesByUserId(request);
        response.status(200).json(userUsages);
      } catch (error) {
        response.status(500).json({ message: "Error fetching user usages" });
      }
    }
  );
  router.get(
    "/savings/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const userSavings = await controller.getSavingsByUserId(request);
        response.status(200).json(userSavings);
      } catch (error) {
        response.status(500).json({ message: "Error fetching user savings" });
      }
    }
  );
  router.patch(
    "/:id/alias",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const { id } = request.params;
        const { body } = request;
        const alias = body.alias;
        const serviceConnection = await controller.updateServiceConnection(
          { alias: alias },
          id
        );
        response.status(200).json(serviceConnection);
      } catch (error) {
        response
          .status(500)
          .json({ message: "Error updating alias of service connection" });
      }
    }
  );
  router.delete(
    "/:id",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const { id } = request.params;
        const serviceConnection = await controller.deleteById(id);
        response.status(200).json(serviceConnection);
      } catch (error) {
        response
          .status(500)
          .json({ message: "Error delete service connection" });
      }
    }
  );

  return router;
}

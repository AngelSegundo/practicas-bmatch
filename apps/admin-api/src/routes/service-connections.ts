import { Request, RequestHandler, Response, Router } from "express";
import ServiceConnectionController from "../controllers/service-connections";

export default function servicesRouter({
  controller,
}: {
  controller: ServiceConnectionController;
}) {
  const router = Router();
  router.post("/", async (request: Request, response: Response) => {
    try {
      const serviceConnection = await controller.createServiceConnection(
        request.body
      );
      response.status(200).json(serviceConnection);
    } catch (error) {
      // todo: create domain error
      response
        .status(500)
        .json({ message: "Error creating service connection" });
    }
  });
  router.get("/", async (request: Request, response: Response) => {
    const userId = request.query.userId;
    const serviceId = request.query.serviceId;
    try {
      const serviceConnections = await controller.getServiceConnections(
        userId as string,
        serviceId as string
      );
      response.status(200).json(serviceConnections);
    } catch (error) {
      console.error(
        JSON.stringify({
          endpoint: "GET /service-connections",
          error: error,
        })
      );
      response
        .status(500)
        .json({ message: "Error fetching service connections" });
    }
  });
  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const serviceConnection = await controller.getById(id);
      response.status(200).json(serviceConnection);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error fetching service connection" });
    }
  });
  router.delete("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const serviceConnection = await controller.deleteById(id);
      response.status(200).json(serviceConnection);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error fetching service connection" });
    }
  });
  return router;
}

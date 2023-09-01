import { Request, RequestHandler, Response, Router } from "express";
import ServiceController from "../controllers/services";

export default function servicesRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: ServiceController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();

  router.get(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const countryId = request.query.countryId;
      try {
        const services = await controller.getServices(countryId as string);
        if (countryId) {
          const servicesActive = services.filter(
            (ser) => ser.status == "active"
          );
          response.status(200).json(servicesActive);
        } else {
          response.status(200).json(services);
        }
      } catch (error) {
        response.status(500).json({ message: "Error fetching services" });
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
        const service = await controller.getById(id);
        response.status(200).json(service);
      } catch (error) {
        console.log(error)
        response.status(500).json({ message: "Error fetching service" });
      }
    }
  );
  return router;
}

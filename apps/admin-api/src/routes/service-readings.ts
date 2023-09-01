import { Request, Response, Router } from "express";
import ServiceReadingController from "../controllers/service-readings";

export default function serviceReadingRouter({
  controller,
}: {
  controller: ServiceReadingController;
}) {
  const router = Router();
  router.get("/", async (request: Request, response: Response) => {
    const connectionId = request.query.connectionId;
    try {
      const serviceReadings =
        await controller.getServiceReadingsByServiceConnectionId(
          connectionId as string
        );
      response.status(200).json(serviceReadings);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error fetching services readings" });
    }
  });
  router.get("/pdf", async (request: Request, response: Response) => {
    const { serviceReadingId, serviceKey } = request.query;
    try {
      const result = await controller.getServiceReadingPdf(
        serviceReadingId as string,
        serviceKey as string
      );
      response.status(200).json(result);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error fetching service reading PDF" });
    }
  });
  router.post("/", async (request: Request, response: Response) => {
    try {
      const serviceReading = await controller.createServiceReading(
        request.body
      );
      response.status(200).json(serviceReading);
    } catch (error) {
      response.status(500).json({ message: "Error creating service reading" });
    }
  });
  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { body } = request;
      const value = body.value;
      const { id } = request.params;
      const serviceReading = await controller.changeServiceReadingValue(
        value as number,
        id
      );
      response.status(200).json(serviceReading);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error change value of service reading" });
    }
  });
  return router;
}

import { FileData } from "domain/services";
import { Request, RequestHandler, Response, Router } from "express";
import ServiceController from "../controllers/services";

export default function servicesRouter({
  controller,
}: {
  controller: ServiceController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    const countryId = request.query.countryId;
    try {
      const services = await controller.getServices(countryId as string);
      if (countryId) {
        const servicesActive = services.filter((ser) => ser.status == "active");
        response.status(200).json(servicesActive);
      } else {
        response.status(200).json(services);
      }
    } catch (error) {
      response.status(500).json({ message: "Error fetching services" });
    }
  });

  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const service = await controller.getById(id);
      response.status(200).json(service);
    } catch (error) {
      response.status(500).json({ message: "Error fetching service" });
    }
  });
  router.post("/", async (request: Request, response: Response) => {
    try {
      const service = await controller.createService(request.body);
      response.status(200).json(service);
    } catch (error) {
      response.status(500).json({ message: "Error creating service" });
    }
  });

  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const service = await controller.update(id, request.body);
      response.status(200).json(service);
    } catch (error) {
      response.status(500).json({ message: "Error updating service" });
    }
  });

  router.put("/:id/logo", async (request: any, response: Response) => {
    try {
      const { id } = request.params;
      const file = request.files.logo;
      const service = await controller.updateServiceLogo(
        {
          buffer: file.data,
          filename: file.name,
          size: file.size,
          mimeType: file.mimeType,
        } as FileData,
        id
      );
      response.status(200).json(service);
    } catch (error) {
      response.status(500).json({ message: "Error updating service logo" });
    }
  });

  router.post(
    "/:id/uploadImageHelper",
    async (request: any, response: Response) => {
      const logger = request.log;
      const id = request.params.id;

      logger.debug("upload file - start");

      const { file } = request.files;
      try {
        const service = await controller.uploadImageHelper(
          {
            buffer: file.data,
            filename: file.name,
            size: file.size,
            mimeType: file.mimeType,
          } as FileData,
          id
        );
        response.status(200).json(service);
      } catch (error) {
        response.status(500).json({ message: "Error uploading files" });
      }
    }
  );

  router.delete(
    "/:id/uploadImageHelper/:index",
    async (request: any, response: Response) => {
      const logger = request.log;
      const id = request.params.id;
      const index: number = parseInt(request.params.index);

      try {
        const service = await controller.deleteHelperImage(id, index);
        response.status(200).json(service);
      } catch (error) {
        response.status(500).json({ message: "Error deleting files" });
      }
    }
  );
  
  return router;
}

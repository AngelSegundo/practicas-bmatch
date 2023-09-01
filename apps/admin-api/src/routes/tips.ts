import { FileData } from "domain/services/storage-service";
import { Request, Response, Router } from "express";
import TipController from "../controllers/tips";

export default function tipsRouter({
  controller,
}: {
  controller: TipController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const tips = await controller.getTips();
      response.status(200).json(tips);
    } catch (error) {
      response.status(500).json({ message: "Error fetching tips" });
    }
  });
  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const tip = await controller.getById(id);
      response.status(200).json(tip);
    } catch (error) {
      response.status(404).json({ message: "Error getting tip" });
    }
  });
  router.post("/", async (request: Request, response: Response) => {
    try {
      const tip = await controller.createTip(request.body);
      response.status(200).json(tip);
    } catch (error) {
      response.status(500).json({ message: "Error creating tip" });
    }
  });
  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const tip = await controller.updateTip(body, id);
      response.status(200).json(tip);
    } catch (error) {
      response.status(500).json({ message: "Error updating tip" });
    }
  });
  router.delete("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const tip = await controller.deleteTip(id);
      response.status(200).json(tip);
    } catch (error) {
      response.status(500).json({ message: "Error deleting tip" });
    }
  });
  router.put("/:id/image", async (request: any, response: Response) => {
    try {
      const { id } = request.params;
      const file = request.files.image;
      const tip = await controller.UploadTipImage(
        {
          buffer: file.data,
          filename: file.name,
          size: file.size,
          mimeType: file.mimeType,
        } as FileData,
        id
      );
      response.status(200).json(tip);
    } catch (error) {
      response.status(500).json({ message: "Error updating image tip" });
    }
  });

  router.delete("/:id/image", async (request: any, response: Response) => {
    const { id } = request.params;

    try {
      const tip = await controller.deleteTipImage(id);
      response.status(200).json(tip);
    } catch (error) {
      response.status(500).json({ message: "Error deleting files" });
    }
  });

  return router;
}

import { Router, Request, Response, RequestHandler } from "express";
import OfficerController from "../controllers/officers";

export default function officersRouter({
  controller,
}: {
  controller: OfficerController;
}) {
  const router = Router();

  router.get("/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    if (typeof id !== "string") {
      response.status(400).json({ message: "Missing id" });
      return;
    }
    try {
      const officer = await controller.getByTaxId(id as string);
      response.status(200).json(officer);
    } catch (error) {
      response.status(500).json({ message: "Error fetching officer" });
    }
  });
  return router;
}

import { Request, RequestHandler, Response, Router } from "express";
import SponsorController from "../controllers/sponsors";

export default function sponsorsRouter({
  controller,
}: {
  controller: SponsorController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const sponsors = await controller.getAll();
      response.status(200).json(sponsors);
    } catch (error) {
      // todo: create domain error
      response.status(500).json({ message: "Error fetching sponsors" });
    }
  });

  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const sponsor = await controller.getById(id);
      response.status(200).json(sponsor);
    } catch (error) {
      response.status(500).json({ message: "Error creating sponsor" });
    }
  });

  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const sponsor = await controller.updateSponsor(body, id);
      response.status(200).json(sponsor);
    } catch (error) {
      response.status(500).json({ message: "Error updating sponsor" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    try {
      const sponsor = await controller.createSponsor(request.body);
      response.status(200).json(sponsor);
    } catch (error) {
      // todo: create domain error
      response.status(500).json({ message: "Error creating sponsor" });
    }
  });

  return router;
}

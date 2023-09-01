import { Router, Request, Response } from "express";
import InvitationController from "../controllers/invitations";

export default function invitationsRouter({
  controller,
}: {
  controller: InvitationController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    const { taxId } = request.query;
    if (typeof taxId !== "string") {
      response.status(400).json({ message: "Missing taxId" });
      return;
    }
    try {
      const invitations = await controller.getByTaxIdWithName(taxId as string);
      response.status(200).json(invitations);
    } catch (error) {
      response.status(500).json({ message: "Error fetching invitations" });
    }
  });

  return router;
}

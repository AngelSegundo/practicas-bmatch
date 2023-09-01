import { Router, Request, Response, RequestHandler } from "express";
import InvitationController from "../controllers/invitations";

export default function invitationsRouter({
  controller,
}: {
  controller: InvitationController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    const sponsorId = request.query.sponsorId;
    request.log.info("Getting invitations");

    try {
      const invitations = await controller.getAll(sponsorId as string);
      response.status(200).json(invitations);
    } catch (error) {
      response.status(500).json({ message: "Error fetching invitations" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    try {
      const invitation = await controller.createInvitation(request.body);
      response.status(200).json(invitation);
    } catch (error) {
      response.status(500).json({ message: "Error creating invitation" });
    }
  });
  
  router.post("/batch", async (request: Request, response: Response) => {
    try {
      const invitations = await controller.createManyInvitations(request.body);
      response.status(200).json(invitations);
    } catch (error) {
      response.status(500).json({ message: "Error creating many invitations" });
    }
  });

  return router;
}

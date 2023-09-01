import { Request, RequestHandler, Response, Router } from "express";
import SponsorController from "../controllers/sponsors";

export default function sponsorsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: SponsorController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();

  router.get(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      if (!request.currentUser) {
        // todo: domain error
        response.status(401).json({ message: "Unauthorized" });
      }
      try {
        const sponsor = await controller.getMySponsor(request);
        response.status(200).json(sponsor);
      } catch (error) {
        // todo: domain error
        response.status(500).json({ message: "Error creating sponsor" });
      }
    }
  );

  return router;
}

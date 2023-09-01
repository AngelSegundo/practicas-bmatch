import { Request, RequestHandler, Response, Router } from "express";
import TipController from "../controllers/tips";

export default function tipsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: TipController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();

  router.get(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const tips = await controller.getTips();
        response.status(200).json(tips);
      } catch (error) {
        response.status(500).json({ message: "Error fetching tips" });
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
        const tip = await controller.getById(id);
        response.status(200).json(tip);
      } catch (error) {
        response.status(404).json({ message: "Error getting tip" });
      }
    }
  );

  return router;
}

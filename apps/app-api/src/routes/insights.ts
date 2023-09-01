import { InsightLevel } from "domain/entities";
import { Request, RequestHandler, Response, Router } from "express";
import InsightController from "../controllers/insights";

export default function insightsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: InsightController;
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
        const insights = await controller.getInsights();
        response.status(200).json(insights);
      } catch (error) {
        response
          .status(500)
          .json({ message: `Error fetching insights -> ERROR: ${error}` });
      }
    }
  );
  return router;
}

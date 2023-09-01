import { Request, Response, Router } from "express";
import InsightController from "../controllers/insights";

export default function insightsRouter({
  controller,
}: {
  controller: InsightController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const insights = await controller.getInsights();
      response.status(200).json(insights);
    } catch (error) {
      response
        .status(500)
        .json({ message: `Error fetching insights -> ERROR: ${error}` });
    }
  });
  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const insight = await controller.getById(id);
      response.status(200).json(insight);
    } catch (error) {
      response
        .status(500)
        .json({ message: `Error fetching insights -> ERROR: ${error}` });
    }
  });
  router.post("/", async (request: Request, response: Response) => {
    try {
      const insight = await controller.createInsight(request.body);
      response.status(200).json(insight);
    } catch (error) {
      response
        .status(500)
        .json({ message: `Error fetching insights -> ERROR: ${error}` });
    }
  });
  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const insight = await controller.updateInsight(body, id);
      response.status(200).json(insight);
    } catch (error) {
   response
     .status(500)
     .json({ message: `Error fetching insights -> ERROR: ${error}` });
    }
  });
  return router;
}

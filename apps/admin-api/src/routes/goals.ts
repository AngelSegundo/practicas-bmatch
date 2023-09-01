import { Request, Response, Router } from "express";
import GoalController from "../controllers/goals";

export default function goalsRouter({
  controller,
}: {
  controller: GoalController;
}) {
  const router = Router();

  router.get(
    "/",

    async (request: Request, response: Response) => {
      try {
        const goals = await controller.getGoals();
        response.status(200).json(goals);
      } catch (error) {
        response.status(500).json({ message: "Error fetching goals" });
      }
    }
  );
  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const goal = await controller.getById(id);
      response.status(200).json(goal);
    } catch (error) {
      response.status(404).json({ message: "Error getting goal" });
    }
  });
  router.post("/", async (request: Request, response: Response) => {
    try {
      const goal = await controller.createGoal(request.body);
      response.status(200).json(goal);
    } catch (error) {
      response.status(500).json({ message: "Error creating goal" });
    }
  });
  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const goal = await controller.updateGoal(body, id);
      response.status(200).json(goal);
    } catch (error) {
      response.status(500).json({ message: "Error updating goal" });
    }
  });
  return router;
}

import { ServiceType } from "domain/entities";
import { Request, RequestHandler, Response, Router } from "express";
import GoalController from "../controllers/goals";

export default function goalsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: GoalController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();

  router.get(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      function compareDesc(a: any, b: any) {
        if (a.updatedAt < b.updatedAt) {
          return 1;
        }
        if (a.updatedAt > b.updatedAt) {
          return -1;
        }
        return 0;
      }
      try {
        const goals = await controller.getGoals();

        const electricityGoal = goals
          .sort(compareDesc)
          .find((goal) => goal.type === ServiceType.electricity);
        const waterGoal = goals
          .sort(compareDesc)
          .find((goal) => goal.type === ServiceType.water);
        const gasGoal = goals
          .sort(compareDesc)
          .find((goal) => goal.type === ServiceType.gas);

        response.status(200).json([electricityGoal, waterGoal, gasGoal]);
      } catch (error) {
        response.status(500).json({ message: "Error fetching goals" });
      }
    }
  );
  return router;
}

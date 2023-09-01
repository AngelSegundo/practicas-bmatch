import { Router, Response, Request, RequestHandler } from "express";
import RewardController from "../controllers/rewards";

export default function rewardsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: RewardController;
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
        const rewardsData = await controller.getRewards();
        // const rewards = rewardsData.map((item)=> )
        response.status(200).json(rewardsData);
      } catch (error) {
        response.status(500).json({ message: "Error fetching rewards" });
      }
    }
  );

  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const reward = await controller.getById(id);
      response.status(200).json(reward);
    } catch (error) {
      response.status(404).json({ message: "Error getting reward" });
    }
  });

  return router;
}

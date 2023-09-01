import { FileData } from "domain/services";
import { Router, Response, Request } from "express";
import RewardController from "../controllers/rewards";

export default function rewardsRouter({
  controller,
}: {
  controller: RewardController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const rewards = await controller.getRewards();
      response.status(200).json(rewards);
    } catch (error) {
      console.log(error );
      response.status(500).json({ message: "Error fetching rewards" });
    }
  });

  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const reward = await controller.getById(id);
      response.status(200).json(reward);
    } catch (error) {
      response.status(404).json({ message: "Error getting reward" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    try {
      const reward = await controller.createReward(request.body);
      response.status(200).json(reward);
    } catch (error) {
      response.status(500).json({ message: "Error creating reward" });
    }
  });
  router.put("/:id/picture", async (request: any, response: Response) => {
    try {
      const { id } = request.params;
      const file = request.files.picture;
      const reward = await controller.updateRewardPicture(
        {
          buffer: file.data,
          filename: file.name,
          size: file.size,
          mimeType: file.mimetype,
        } as FileData,
        id
      );
      response.status(200).json(reward);
    } catch (error) {
      response.status(500).json({ message: "Error updating reward picture" });
    }
  });
  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const reward = await controller.updateReward(body, id);
      response.status(200).json(reward);
    } catch (error) {
      response.status(500).json({ message: "Error updating reward" });
    }
  });

  return router;
}

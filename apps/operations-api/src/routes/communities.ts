import { Router, Response, Request } from "express";
import CommunityController from "../controllers/communities";

export default function communitiesRouter({
  controller,
}: {
  controller: CommunityController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const communities = await controller.getCommunities();
      response.status(200).json(communities);
    } catch (error) {
      response.status(500).json({ message: "Error fetching communities" });
    }
  });
  router.get(
    "/compute-communities-savings",
    async (request: Request, response: Response) => {
      try {
        const communities = await controller.getCommunitiesRanking();

        response.status(200).json(communities);
      } catch (error) {
        response
          .status(500)
          .json({ message: "Error fetching communities rankings" });
      }
    }
  );

  return router;
}

import { Request, RequestHandler, Response, Router } from "express";
import RankingController from "../controllers/rankings";

export default function rankingsRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: RankingController;
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
        const rankings = await controller.getRankings();
        response.status(200).json(rankings);
      } catch (error) {
        response.status(500).json({ message: "Error fetching rankings" });
      }
    }
  );
  // router.get(
  //   "/:id",
  //   useAuthenticationMW,
  //   useCurrentUserMW,
  //   async (request: Request, response: Response) => {
  //     try {
  //       const { id } = request.params;
  //       const ranking = await controller.getById(id);
  //       response.status(200).json(ranking);
  //     } catch (error) {
  //       response.status(404).json({ message: "Error getting ranking" });
  //     }
  //   }
  // );

  return router;
}

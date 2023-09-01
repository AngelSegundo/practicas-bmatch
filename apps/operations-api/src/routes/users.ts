import { Request, Response, Router } from "express";
import UserController from "../controllers/users";

export default function usersRouter({
  controller,
}: {
  controller: UserController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    try {
      const users = await controller.getAll();
      response.status(200).json(users);
    } catch (error) {
      response.status(500).json({ message: "Error fetching users" });
    }
  });
  router.get(
    "/compute-user-savings",
    async (request: Request, response: Response) => {
      try {
        const { year, month } = request.query;
        let users = [];
        if (year && month) {
          users = await controller.getUsersRankingByMonthYear({
            month: month as string,
            year: year as string,
          });
        } else {
          users = await controller.getUsersRanking();
        }

        response.status(200).json(users);
      } catch (error) {
        response.status(500).json({ message: "Error fetching users" });
      }
    }
  );

  return router;
}

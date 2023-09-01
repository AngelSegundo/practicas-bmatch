import { FileData } from "domain/services";
import { Request, RequestHandler, Response, Router } from "express";
import UserController from "../controllers/users";
import { firebaseApp } from "../infrastructure/firebase";

export default function usersRouter({
  controller,
}: {
  controller: UserController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    const sponsorId = request.query.sponsorId;
    const communityId = request.query.communityId;
    request.log.info("Getting users");
    try {
      const users = await controller.getAll(
        sponsorId as string,
        communityId as string
      );

      const usersWithScoring = users.filter(
        (user) => user.scoring !== undefined
      );

      users.sort((a, b) => {
        if (a.scoring && b.scoring) {
          return a.scoring?.currentRanking - b.scoring?.currentRanking;
        } else {
          return 0;
        }
      });
      response.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        request.log.error({
          endpoint: "GET /users",
          error: error,
          message: error.message,
        });
      }
      response.status(500).json({ message: "Error fetching users" });
    }
  });

  router.get("/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    const { includeCommunities = false } = request.query;
    try {
      const user = await controller.getById(id, includeCommunities as boolean);

      response.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          JSON.stringify({
            endpoint: `GET /users/${id}`,
            error: error,
            message: error.message,
          })
        );
      }
      response.status(500).json({ message: "Error fetching user" });
    }
  });

  router.delete("/:id", async (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const auth = firebaseApp.auth();
      await auth
        .updateUser(id, {disabled: true})
        .then(() => {
          console.log("Successfully deleted user");
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
      const user = await controller.deleteUser(id);
      response.status(200).json(user);
    } catch (error) {
      response.status(500).json({ message: "Error delete user" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    try {
      const { body } = request;
      const user = await controller.createUser(body);
      response.status(200).json(user);
    } catch (error) {
      response.status(500).json({ message: `${error as string}` });
    }
  });

  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const user = await controller.updateUser(body, id);
      response.status(200).json(user);
    } catch (error) {
      response.status(500).json({ message: "Error updating user" });
    }
  });

  router.put(
    "/:id/profile-picture",
    async (request: any, response: Response) => {
      try {
        const { id } = request.params;
        const file = request.files.profilePicture;
        const user = await controller.updateUserPictureProfile(
          {
            buffer: file.data,
            filename: file.name,
            size: file.size,
            mimeType: file.mimeType,
          } as FileData,
          id
        );
        response.status(200).json(user);
      } catch (error) {
        response.status(500).json({ message: "Error updating user picture" });
      }
    }
  );
  return router;
}

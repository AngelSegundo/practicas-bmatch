import { Request, RequestHandler, Response, Router } from "express";
import { FileData } from "domain/services";
import UserController from "../controllers/users";
import { firebaseApp } from "../infrastructure/firebase";
import { FirebaseAuthProvider } from "../services/firebase-auth";
import axios from "axios";

export default function usersRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
  authProvider,
}: {
  controller: UserController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
  authProvider: FirebaseAuthProvider;
}) {
  const router = Router();

  router.get(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
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
        usersWithScoring.sort((a, b) => {
          if (a.scoring && b.scoring) {
            return a.scoring?.currentRanking - b.scoring?.currentRanking;
          } else {
            return 0;
          }
        });
        response.status(200).json(usersWithScoring);
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
    }
  );

  router.post(
    "/me",
    useAuthenticationMW,
    async (request: Request, response: Response) => {
      try {
        const user = await controller.createMyUser(request, request.body);
        response.status(200).json(user);
      } catch (error) {
        response.status(500).json({ message: `${error as string}` });
      }
    }
  );

  router.get(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const user = await controller.getMyUser(request);
        response.status(200).json(user);
      } catch (error) {
        // todo: domain error
        response.status(500).json({ message: "Error fetching user" });
      }
    }
  );

  router.patch(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const { body } = request;
        const user = await controller.updateUser(request, body);
        response.status(200).json(user);
      } catch (error) {
        // todo: domain error
        response.status(500).json({ message: "Error updating user" });
      }
    }
  );

  router.put(
    "/me/profile-picture",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const file = request.files.profilePicture;
        const user = await controller.updateUserPictureProfile(request, {
          buffer: file.data,
          filename: file.name,
          size: file.size,
          mimeType: file.mimeType,
        } as FileData);
        response.status(200).json(user);
      } catch (error) {
        // todo: domain error
        response.status(500).json({ message: "Error updating user picture" });
      }
    }
  );

  router.post(
    "/reset-password",
    async (request: Request, response: Response) => {
      try {
        const { body } = request;
        const { email } = body;

        const auth = firebaseApp.auth();

        const user = await auth.getUserByEmail(email);

        if (user) {
          const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`;
          const response = await axios.post(url, body, {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-User-Project": process.env.GOOGLE_CLOUD_PROJECT,
            },
          });
        }

        response.status(200).json({ success: true });
      } catch (error) {
        // todo: domain error
        request.log.error(error);
        response.status(500).json({ message: "Error reseting password" });
      }
    }
  );

  router.delete(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      if (!request.currentUser) {
        response.status(401).json({ message: "Unauthorized" });
      } else {
        try {
          const auth = firebaseApp.auth();
          await auth
            .updateUser(request.currentUser.id, {disabled: true })
            .then(() => {
              console.log("Successfully deleted user");
            })
            .catch((error) => {
              console.log("Error deleting user:", error);
            });
          const user = await controller.deleteById(request);
          response.status(200).json(user);
        } catch (error) {
          response.status(500).json({ message: "Error delete user" });
        }
      }
    }
  );

  return router;
}

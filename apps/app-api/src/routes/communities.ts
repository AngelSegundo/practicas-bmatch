import { FileData } from "domain/services";
import { Router, Response, Request, RequestHandler } from "express";
import CommunityController from "../controllers/communities";

export default function communitiesRouter({
  controller,
  useAuthenticationMW,
  useCurrentUserMW,
}: {
  controller: CommunityController;
  useAuthenticationMW: RequestHandler;
  useCurrentUserMW: RequestHandler;
}) {
  const router = Router();
  router.post(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const community = await controller.createCommunity(
          request,
          request.body
        );
        response.status(200).json(community);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(500).json({ message: "Error creating community" });
      }
    }
  );
  router.put(
    "/:id/logo",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: any, response: Response) => {
      try {
        const { id } = request.params;
        const file = request.files.profilePicture;
        const community = await controller.updateCommunityLogo(
          {
            buffer: file.data,
            filename: file.name,
            size: file.size,
            mimeType: file.mimeType,
          } as FileData,
          id
        );
        response.status(200).json(community);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(500).json({ message: "Error updating community logo" });
      }
    }
  );
  router.get(
    "/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { currentUser: user } = request;
      try {
        const communitiesData = await controller.getCommunities();
        const communities = communitiesData
          .filter((com) => {
            if (com.status !== "active") return false;
            if (com.isPublic) return true;
            if (user?.communityIds.includes(com.id)) return true;
            if (!com.isVisible) return false;

            // corporate filter
            if (com.isCorporate === false) return true;
            if (com.founderId === user?.sponsorId) {
              return true;
            }
          })
          .map((item) => {
            if (user?.communityIds.includes(item.id)) return item;
            else return { ...item, accessCode: "" };
          });

        communities.sort((a, b) => {
          if (a.scoring && b.scoring) {
            return a.scoring?.currentRanking - b.scoring?.currentRanking;
          } else {
            return 0;
          }
        });

        response.status(200).json(communities);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(500).json({ message: "Error fetching communities" });
      }
    }
  );
  router.get(
    "/searchText",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const searchText = request.query.searchText as string;
      try {
        const communitiesData =
          await controller.getPublicCommunitiesBySearchText(searchText);
        response.status(200).json(communitiesData);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response
          .status(500)
          .json({ message: "Error fetching communities by search text" });
      }
    }
  );
  router.get(
    "/private",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const accessCode = request.query.accessCode;
      try {
        const communityId = await controller.getCommunityIdByAccessCode(
          request,
          accessCode as string
        );
        if (communityId) response.status(200).json(communityId);
        else
          response
            .status(400)
            .json("The code does not match to view the community");
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response
          .status(500)
          .json({ message: "Error fetching community by access code" });
      }
    }
  );
  router.get(
    "/me",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { currentUser: user } = request;
      if (!user) {
        // todo: domain error
        response.status(401).json({ message: "Unauthorized" });
        return;
      }
      try {
        const communities = await controller.getMyCommunities(request);
        response.status(200).json(communities);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(500).json({ message: "Error fetching communities" });
      }
    }
  );
  router.get(
    "/:id/detailed",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const { id } = request.params;
        const accessCode = request.query.accessCode;

        const community = await controller.getDetailedById(
          request,
          accessCode as string,
          id
        );
        response.status(200).json(community);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response
          .status(404)
          .json({ message: "Error getting detailed community" });
      }
    }
  );
  router.get(
    "/:id",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      try {
        const { id } = request.params;
        const accessCode = request.query.accessCode;

        const community = await controller.getById(
          request,
          accessCode as string,
          id
        );
        response.status(200).json(community);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(404).json({ message: "Error getting community" });
      }
    }
  );
  router.patch(
    "/:communityId/join/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { communityId } = request.params;
      const { currentUser } = request;
      try {
        const { body } = request;
        const user = await controller.joinTheCommunity(
          request,
          body.accessCode,
          communityId
        );
        response.status(200).json(user);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        // todo: domain error
        response.status(500).json({ message: "Error join user to community" });
      }
    }
  );
  router.patch(
    "/:communityId/leave/",
    useAuthenticationMW,
    useCurrentUserMW,
    async (request: Request, response: Response) => {
      const { communityId } = request.params;
      try {
        const user = await controller.leaveTheCommunity(request, communityId);
        response.status(200).json(user);
      } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
          return;
        }
        response.status(500).json({ message: "Error leave the community" });
      }
    }
  );
  return router;
}

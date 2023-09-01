import { FileData } from "domain/services";
import { Router, Response, Request } from "express";
import CommunityController from "../controllers/communities";

export default function communitiesRouter({
  controller,
}: {
  controller: CommunityController;
}) {
  const router = Router();

  router.get("/", async (request: Request, response: Response) => {
    const sponsorId = request.query.sponsorId;
    const withPublics = request.query.withPublics as unknown as boolean;
    try {
      const communities = await controller.getCommunities(
        sponsorId as string,
        withPublics
      );
      response.status(200).json(communities);
    } catch (error) {
      response.status(500).json({ message: "Error fetching communities" });
    }
  });

  router.get("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const community = await controller.getById(id);
      response.status(200).json(community);
    } catch (error) {
      response.status(404).json({ message: "Error getting community" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    try {
      const community = await controller.createCommunity(request.body);
      response.status(200).json(community);
    } catch (error) {
      response.status(500).json({ message: "Error creating community" });
    }
  });

  router.patch("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const community = await controller.updateCommunity(body, id);
      response.status(200).json(community);
    } catch (error) {
      response.status(500).json({ message: "Error updating community" });
    }
  });

  router.delete("/:id", async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      await controller.deleteCommunity(id);
      response.status(200).json({ success: true });
    } catch (error) {
      response.status(500).json({ message: "Error deleting community" });
    }
  });

  router.put("/:id/logo", async (request: any, response: Response) => {
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
      response.status(500).json({ message: "Error updating community logo" });
    }
  });

  return router;
}

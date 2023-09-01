import { CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories";
import { StorageService } from "../../services";
import Fuse from "fuse.js";
export interface GetPublicCommunitiesBySearchTextUseCaseInput {
  communityRepository: CommunityRepository;
  storageService: StorageService;
}
export interface GetPublicCommunitiesBySearchTextUseCase {
  execute(searchText: string): Promise<CommunityDTO[]>;
}

export class GetPublicCommunitiesBySearchTextUseCaseImpl
  implements GetPublicCommunitiesBySearchTextUseCase
{
  private communityRepository: CommunityRepository;
  private storageService: StorageService;
  constructor(props: GetPublicCommunitiesBySearchTextUseCaseInput) {
    this.communityRepository = props.communityRepository;
    this.storageService = props.storageService;
  }

  async execute(searchText: string): Promise<CommunityDTO[]> {
    const communitiesData =
      await this.communityRepository.getPublicCommunities();
    const options = {
      includeScore: true,
      keys: ["name", "description"],
    };
    const fuse = new Fuse(communitiesData, options);
    const fuseCommunities: Fuse.FuseResult<CommunityDTO>[] =
      fuse.search(searchText);
    const communities: CommunityDTO[] = await Promise.all(
      fuseCommunities.map(
        async (fuseCommunity: Fuse.FuseResult<CommunityDTO>) => {
          const community = fuseCommunity.item;
          if (community && community.profilePicture) {
            const profilePictureUrl =
              await this.storageService.getFileSignedUrl({
                bucket: process.env.FILES_BUCKET as string,
                path: `communities/${community.id}/profile-picture/${community.profilePicture}`,
              });
            community.profilePicture = profilePictureUrl;
          }
          return community;
        }
      )
    );
    return communities;
  }
}

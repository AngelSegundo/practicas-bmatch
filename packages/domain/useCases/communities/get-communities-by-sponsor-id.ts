import { CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories";
import { StorageService } from "../../services";
export interface GetCommunitiesBySponsorIdUseCaseInput {
  communityRepository: CommunityRepository;
  storageService: StorageService;
}
export interface GetCommunitiesBySponsorIdUseCase {
  execute(sponsorID: string): Promise<CommunityDTO[]>;
}

export class GetCommunitiesBySponsorIdUseCaseImpl
  implements GetCommunitiesBySponsorIdUseCase
{
  private communityRepository: CommunityRepository;
  private storageService: StorageService;
  constructor(props: GetCommunitiesBySponsorIdUseCaseInput) {
    this.communityRepository = props.communityRepository;
    this.storageService = props.storageService;
  }

  async execute(sponsorID: string): Promise<CommunityDTO[]> {
    const communitiesData =
      await this.communityRepository.getCommunitiesBySponsorId(sponsorID);
    const communities = await Promise.all(
      communitiesData.map(async (community) => {
        if (community && community.profilePicture) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `communities/${community.id}/profile-picture/${community.profilePicture}`,
          });
          community.profilePicture = profilePictureUrl;
        }
        return community;
      })
    );
    return communities;
  }
}

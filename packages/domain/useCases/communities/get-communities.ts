import { CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories/community-repository";
import { StorageService } from "../../services";
export interface GetCommunitiesUseCaseInput {
  communityRepository: CommunityRepository;
  storageService: StorageService;
}
export interface GetCommunitiesUseCase {
  execute(): Promise<CommunityDTO[]>;
}

export class GetCommunitiesUseCaseImpl implements GetCommunitiesUseCase {
  private communityRepository: CommunityRepository;
  private storageService: StorageService;

  constructor(props: GetCommunitiesUseCaseInput) {
    this.communityRepository = props.communityRepository;
    this.storageService = props.storageService;
  }

  async execute(): Promise<CommunityDTO[]> {
    const communitiesData = await this.communityRepository.getCommunities();
    const communities = await Promise.all(
      communitiesData.map(async (community) => {
        if (community && community.profilePicture) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            //bucket: process.env.FILES_BUCKET as string,
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

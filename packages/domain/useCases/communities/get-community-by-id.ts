import { CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories/community-repository";
import { StorageService } from "../../services";

export interface GetCommunityByIdUseCaseInput {
  communityRepository: CommunityRepository;
  storageService: StorageService;
}
export interface GetCommunityByIdUseCase {
  execute(id: string): Promise<CommunityDTO>;
}

export class GetCommunityByIdUseCaseImpl implements GetCommunityByIdUseCase {
  private communityRepository: CommunityRepository;
  private storageService: StorageService;

  constructor(props: GetCommunityByIdUseCaseInput) {
    this.communityRepository = props.communityRepository;
    this.storageService = props.storageService;
  }

  async execute(id: string): Promise<CommunityDTO> {
    const community = await this.communityRepository.getCommunityById(id);
    if (community && community.profilePicture) {
      const profilePictureUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `communities/${id}/profile-picture/${community.profilePicture}`,
      });
      community.profilePicture = profilePictureUrl;
    }
    return community;
  }
}

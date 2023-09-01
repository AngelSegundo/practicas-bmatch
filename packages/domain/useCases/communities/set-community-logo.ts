import { CommunityDTO } from "../../entities/community";
import { CommunityRepository } from "../../repositories";
import { FileData, StorageService } from "../../services";

export interface SetCommunityLogoUseCaseInput {
  id: string;
  profilePicture: FileData;
}
``;
export interface SetCommunityLogoUseCase {
  execute(input: SetCommunityLogoUseCaseInput): Promise<CommunityDTO>;
}

export interface SetCommunityLogoUseCaseProps {
  communityRepository: CommunityRepository;
  storageService: StorageService;
}

export class SetCommunityLogoUseCaseImpl implements SetCommunityLogoUseCase {
  communityRepository: CommunityRepository;
  storageService: StorageService;
  constructor(props: SetCommunityLogoUseCaseProps) {
    this.communityRepository = props.communityRepository;
    this.storageService = props.storageService;
  }

  async execute(input: SetCommunityLogoUseCaseInput): Promise<CommunityDTO> {
    const { id, profilePicture } = input;
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: profilePicture,
      path: `communities/${id}/profile-picture/`,
      fileName: profilePicture.filename,
    });
    const updatedCommunity = await this.communityRepository.updateCommunity(
      {
        profilePicture: profilePicture.filename,
      },
      id
    );

    const profilePictureUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `communities/${id}/profile-picture/${updatedCommunity.profilePicture}`,
    });

    return { ...updatedCommunity, profilePicture: profilePictureUrl };
  }
}

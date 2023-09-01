import { UserDTO } from "../../entities/user";
import { UserRepository } from "../../repositories/user-repository";
import { FileData, StorageService } from "../../services";

export interface SetUserProfilePictureUseCaseInput {
  id: string;
  profilePicture: FileData;
}
export interface SetUserProfilePictureUseCase {
  execute(input: SetUserProfilePictureUseCaseInput): Promise<UserDTO>;
}

export interface SetUserProfilePictureUseCaseProps {
  userRepository: UserRepository;
  storageService: StorageService;
}

export class SetUserProfilePictureUseCaseImpl
  implements SetUserProfilePictureUseCase
{
  userRepository: UserRepository;
  storageService: StorageService;
  constructor(props: SetUserProfilePictureUseCaseProps) {
    this.userRepository = props.userRepository;
    this.storageService = props.storageService;
  }

  async execute(input: SetUserProfilePictureUseCaseInput): Promise<UserDTO> {
    const { id, profilePicture } = input;
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: profilePicture,
      path: `users/${id}/profile-picture/`,
      fileName: profilePicture.filename,
    });
    const updatedUser = await this.userRepository.updateUser(
      {
        profilePicture: profilePicture.filename,
      },
      id
    );

    const profilePictureUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `users/${id}/profile-picture/${updatedUser.profilePicture}`,
    });

    return { ...updatedUser, profilePicture: profilePictureUrl };
  }
}

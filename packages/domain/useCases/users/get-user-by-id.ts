import { UserDTO } from "../../entities";
import { UserRepository } from "../../repositories";
import { StorageService } from "../../services";

export interface GetUserByIdUseCaseInput {
  userRepository: UserRepository;
  storageService: StorageService;
}

export interface GetUserByIdUseCase {
  execute(id: string): Promise<UserDTO>;
}

export class GetUserByIdUseCaseImpl implements GetUserByIdUseCase {
  private userRepository: UserRepository;
  private storageService: StorageService;

  constructor(props: GetUserByIdUseCaseInput) {
    this.userRepository = props.userRepository;
    this.storageService = props.storageService;
  }

  async execute(id: string): Promise<UserDTO> {
    const user = await this.userRepository.getUserById(id);
    if (user && user.profilePicture) {
      const profilePictureUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `users/${id}/profile-picture/${user.profilePicture}`,
      });
      user.profilePicture = profilePictureUrl;
    }
    return user;
  }
}

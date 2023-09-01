import { UserDTO } from "../../entities/user";
import { UserRepository } from "../../repositories/user-repository";
import { StorageService } from "../../services";

export interface GetUsersUseCaseInput {
  userRepository: UserRepository;
  storageService: StorageService;
}

export interface GetUsersUseCase {
  execute(): Promise<UserDTO[]>;
}

export class GetUsersUseCaseImpl implements GetUsersUseCase {
  private userRepository: UserRepository;
  private storageService: StorageService;

  constructor(props: GetUsersUseCaseInput) {
    this.userRepository = props.userRepository;
    this.storageService = props.storageService;
  }
  async execute(): Promise<UserDTO[]> {
    const usersData = await this.userRepository.getUsers();
    const users = await Promise.all(
      usersData.map(async (user) => {
        if (user && user.profilePicture) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `users/${user.id}/profile-picture/${user.profilePicture}`,
          });
          user.profilePicture = profilePictureUrl;
        }
        return user;
      })
    );
    return users;
  }
}

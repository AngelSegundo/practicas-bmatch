import { UserDTO } from "../../entities";
import { UserRepository } from "../../repositories";
import { StorageService } from "../../services";
export interface GetUsersBySponsorIdUseCaseInput {
  userRepository: UserRepository;
  storageService: StorageService;
}
export interface GetUsersBySponsorIdUseCase {
  execute(sponsorID: string): Promise<UserDTO[]>;
}
export class GetUsersBySponsorIdUseCaseImpl
  implements GetUsersBySponsorIdUseCase
{
  private userRepository: UserRepository;
  private storageService: StorageService;
  constructor(props: GetUsersBySponsorIdUseCaseInput) {
    this.userRepository = props.userRepository;
    this.storageService = props.storageService;
  }
  async execute(sponsorID: string): Promise<UserDTO[]> {
    const usersData = await this.userRepository.getUsersBySponsorId(sponsorID);
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

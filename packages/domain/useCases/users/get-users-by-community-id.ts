import { UserDTO } from "../../entities";
import { UserRepository } from "../../repositories";
import { StorageService } from "../../services";
export interface GetUsersByCommunityIdUseCaseInput {
  userRepository: UserRepository;
  storageService: StorageService;
}
export interface GetUsersByCommunityIdUseCase {
  execute(communityID: string): Promise<UserDTO[]>;
}

export class GetUsersByCommunityIdUseCaseImpl
  implements GetUsersByCommunityIdUseCase
{
  private userRepository: UserRepository;
  private storageService: StorageService;
  constructor(props: GetUsersByCommunityIdUseCaseInput) {
    this.userRepository = props.userRepository;
    this.storageService = props.storageService;
  }
  async execute(communityID: string): Promise<UserDTO[]> {
    const usersData = await this.userRepository.getUsersByCommunityId(
      communityID
    );
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

    users.sort((a, b) => {
      if (a.scoring && b.scoring) {
        return a.scoring?.currentRanking - b.scoring?.currentRanking;
      } else {
        return 0;
      }
    });
    
    return users;
  }
}

import { User } from "../../entities";
import { CommunityRepository, UserRepository } from "../../repositories";

export interface DeleteCommunityUseCaseInput {
  id: string;
}
export interface DeleteCommunityUseCase {
  execute(input: DeleteCommunityUseCaseInput): Promise<void>;
}

export interface DeleteCommunityUseCaseProps {
  communityRepository: CommunityRepository;
  userRepository: UserRepository;
}

export class DeleteCommunityUseCaseImpl implements DeleteCommunityUseCase {
  private communityRepository: CommunityRepository;
  private userRepository: UserRepository;

  constructor(props: DeleteCommunityUseCaseProps) {
    this.communityRepository = props.communityRepository;
    this.userRepository = props.userRepository;
  }

  async execute(input: DeleteCommunityUseCaseInput): Promise<void> {
    const { id } = input;
    const usersByCommunity = this.userRepository.getUsersByCommunityId(id);

    (await usersByCommunity).forEach(async (user: Partial<User>) => {
      if (user.communityIds) {
        const updatedCommunities = user.communityIds.filter(
          (communityId) => communityId !== id
        );
        user.communityIds = updatedCommunities;
      }
    });

    return this.communityRepository.deleteCommunity(id);
  }
}

import { Community, CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories";

export interface UpdateCommunityUseCaseInput {
  id: string;
  community: Partial<Community>;
}
export interface UpdateCommunityUseCase {
  execute(input: UpdateCommunityUseCaseInput): Promise<CommunityDTO>;
}

export interface UpdateCommunityUseCaseProps {
  communityRepository: CommunityRepository;
}

export class UpdateCommunityUseCaseImpl implements UpdateCommunityUseCase {
  communityRepository: CommunityRepository;
  constructor(props: UpdateCommunityUseCaseProps) {
    this.communityRepository = props.communityRepository;
  }

  async execute(input: UpdateCommunityUseCaseInput): Promise<CommunityDTO> {
    const { community, id } = input;
    return this.communityRepository.updateCommunity(community, id);
  }
}

import { Community, CommunityDTO } from "../../entities";
import { CommunityRepository } from "../../repositories/community-repository";

export interface CreateCommunityUseCase {
  execute(data: Community): Promise<CommunityDTO>;
}

export class CreateCommunityUseCaseImpl implements CreateCommunityUseCase {
  communityRepository: CommunityRepository;
  constructor(sponsorRepository: CommunityRepository) {
    this.communityRepository = sponsorRepository;
  }

  async execute(data: Community): Promise<CommunityDTO> {
    if (data.isPublic === false) {
      const accessCode = Math.random().toString(36).slice(2, 8);
      data = { ...data, accessCode: accessCode, status: "active" };
    }
    return this.communityRepository.createCommunity(data);
  }
}

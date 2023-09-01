import { CommunityRepository } from "../../repositories";
export interface GetCommunityIdByAccessCodeUseCaseInput {
  communityRepository: CommunityRepository;
}
export interface GetCommunityIdByAccessCodeUseCase {
  execute(accessCode: string): Promise<{ communityId: string } | undefined>;
}

export class GetCommunityIdByAccessCodeUseCaseImpl
  implements GetCommunityIdByAccessCodeUseCase
{
  private communityRepository: CommunityRepository;
  constructor(props: GetCommunityIdByAccessCodeUseCaseInput) {
    this.communityRepository = props.communityRepository;
  }

  async execute(
    accessCode: string
  ): Promise<{ communityId: string } | undefined> {
    return this.communityRepository.getCommunityIdByAccessCode(accessCode);
  }
}

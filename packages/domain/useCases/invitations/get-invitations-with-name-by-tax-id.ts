import { InvitationDTO } from "../../entities";
import { InvitationRepository, CommunityRepository } from "../../repositories";

export interface GetInvitationsByTaxIdWithNameUseCase {
  execute(taxId: string): Promise<InvitationDTO[]>;
}

export class GetInvitationsByTaxIdWithNameUseCaseImpl
  implements GetInvitationsByTaxIdWithNameUseCase
{
  private invitationRepository: InvitationRepository;
  private communityRepository: CommunityRepository;

  constructor(
    invitationRepository: InvitationRepository,
    communityRepository: CommunityRepository
  ) {
    this.invitationRepository = invitationRepository;
    this.communityRepository = communityRepository;
  }

  async execute(taxId: string): Promise<InvitationDTO[]> {
    let invitations = await this.invitationRepository.getInvitationsByTaxId(
      taxId
    );

    if (invitations.length === 0) {
      const taxIdWithDash = `${taxId.slice(0, -1)}-${taxId.slice(-1)}`;
      invitations = await this.invitationRepository.getInvitationsByTaxId(
        taxIdWithDash
      );
    }
    const latestInvitation = invitations[invitations.length - 1];

    const communitiesNames: string[] = await Promise.all(
      latestInvitation.communityIds.map(async (communityId) => {
        const community = await this.communityRepository.getCommunityById(
          communityId
        );
        return community.name;
      })
    );

    latestInvitation.communityIds = communitiesNames;

    return [latestInvitation];
  }
}

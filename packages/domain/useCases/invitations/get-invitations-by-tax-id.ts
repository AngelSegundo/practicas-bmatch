import { InvitationDTO } from "../../entities";
import { InvitationRepository, CommunityRepository } from "../../repositories";

export interface GetInvitationsByTaxIdUseCase {
  execute(taxId: string): Promise<InvitationDTO[]>;
}

export class GetInvitationsByTaxIdUseCaseImpl
  implements GetInvitationsByTaxIdUseCase
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

    return [latestInvitation];
  }
}

import { InvitationDTO } from "../../entities";
import { InvitationRepository } from "../../repositories";

export interface GetInvitationsByEmailUseCase {
  execute(email: string): Promise<InvitationDTO[]>;
}

export class GetInvitationsByEmailUseCaseImpl
  implements GetInvitationsByEmailUseCase
{
  private invitationRepository: InvitationRepository;
  constructor(invitationRepository: InvitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute(email: string): Promise<InvitationDTO[]> {
    return this.invitationRepository.getInvitationsByEmail(email);
  }
}

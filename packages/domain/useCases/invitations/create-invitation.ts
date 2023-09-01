import { Invitation, InvitationDTO } from "../../entities";
import { InvitationRepository } from "../../repositories";

export interface CreateInvitationUseCase {
  execute(data: Invitation): Promise<InvitationDTO>;
}

export class CreateInvitationUseCaseImpl implements CreateInvitationUseCase {
  private invitationRepository: InvitationRepository;
  constructor(invitationRepository: InvitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  execute(data: Invitation): Promise<InvitationDTO> {
    return this.invitationRepository.createInvitation(data);
  }
}
import { InvitationDTO } from "../../entities/invitation";
import { InvitationRepository } from "../../repositories/invitation-repository";

export interface GetInvitationsUseCase {
  execute(): Promise<InvitationDTO[]>;
}

export class GetInvitationsUseCaseImpl implements GetInvitationsUseCase {
  invitationRepository: InvitationRepository;
  constructor(invitationRepository: InvitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  async execute(): Promise<InvitationDTO[]> {
    return this.invitationRepository.getInvitations();
  }
}

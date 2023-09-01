import { InvitationDTO } from "../../entities";
import { InvitationRepository } from "../../repositories";

export interface ConsumeInvitationUseCase {
  execute(invitationIds: string[]): Promise<InvitationDTO>[];
}

export class ConsumeInvitationUseCaseImpl implements ConsumeInvitationUseCase {
  private invitationRepository: InvitationRepository;
  constructor(invitationRepository: InvitationRepository) {
    this.invitationRepository = invitationRepository;
  }
  execute(invitationIds: string[]): Promise<InvitationDTO>[] {
    return this.invitationRepository.consumeInvitation(invitationIds);
  }
}

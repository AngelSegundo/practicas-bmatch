import { InvitationRepository, UserRepository } from "../../repositories";

export interface DeleteUserUseCase {
  execute(id: string): Promise<void>;
}
export class DeleteUserUseCaseImpl implements DeleteUserUseCase {
  userRepository: UserRepository;
  invitationRepository: InvitationRepository;
  constructor(
    userRepository: UserRepository,
    invitationRepository: InvitationRepository
  ) {
    this.userRepository = userRepository;
    this.invitationRepository = invitationRepository;
  }
  async execute(id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    const invitations = await this.invitationRepository.getInvitationsByEmail(
      user.email
    );
    await Promise.all(
      invitations.map(async (invitation) => {
        this.invitationRepository.deleteInvitation(invitation.id);
      })
    );
    return this.userRepository.deleteUser(id);
  }
}

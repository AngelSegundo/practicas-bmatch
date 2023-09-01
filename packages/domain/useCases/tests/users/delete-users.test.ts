import { InvitationRepository, UserRepositoryImpl } from "../../../repositories";
import { DeleteUserUseCaseImpl } from "../../users";

describe('DeleteUserUseCaseImpl', () => {
  let deleteUserUseCase: DeleteUserUseCaseImpl;
  let userRepository: UserRepositoryImpl;
  let invitationRepository: InvitationRepository;

  beforeEach(() => {
    deleteUserUseCase = new DeleteUserUseCaseImpl(userRepository, invitationRepository);
  });

  it('should delete user and related invitations', async () => {
    const userId = '';
    const userEmail = '';

    userRepository.getUserById = jest.fn().mockResolvedValue({
      id: userId,
      name: 'Test User',
      email: userEmail,
    });

    invitationRepository.getInvitationsByEmail = jest.fn().mockResolvedValue([
      { id: '123', email: userEmail },
      { id: '456', email: userEmail },
    ]);

    invitationRepository.deleteInvitation = jest.fn().mockResolvedValue(undefined);
    await deleteUserUseCase.execute(userId);

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);

    expect(invitationRepository.getInvitationsByEmail).toHaveBeenCalledWith(userEmail);

    expect(invitationRepository.deleteInvitation).toHaveBeenCalledWith('123');

    expect(invitationRepository.deleteInvitation).toHaveBeenCalledWith('456');

    expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
  });
});

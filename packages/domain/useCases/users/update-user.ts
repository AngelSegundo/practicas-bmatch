import { User, UserDTO } from "../../entities/user";
import { UserRepository } from "../../repositories/user-repository";

export interface UpdateUserUseCaseInput {
  id: string;
  user: Partial<User>;
}
export interface UpdateUserUseCase {
  execute(input: UpdateUserUseCaseInput): Promise<UserDTO>;
}

export interface UpdateUserUseCaseProps {
  userRepository: UserRepository;
}

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  userRepository: UserRepository;
  constructor(props: UpdateUserUseCaseProps) {
    this.userRepository = props.userRepository;
  }

  async execute(input: UpdateUserUseCaseInput): Promise<UserDTO> {
    const { user, id } = input;
    return this.userRepository.updateUser(user, id);
  }
}

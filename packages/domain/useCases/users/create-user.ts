import { User, UserDTO } from "../../entities/user";
import { UserRepository } from "../../repositories/user-repository";

export interface CreateUserUseCaseInput {
  id: string;
  user: User;
}
export interface CreateUserUseCase {
  execute(input: CreateUserUseCaseInput): Promise<UserDTO>;
}

export interface CreateUserUseCaseProps {
  userRepository: UserRepository;
}

export class CreateUserUseCaseImpl implements CreateUserUseCase {
  userRepository: UserRepository;
  constructor(props: CreateUserUseCaseProps) {
    this.userRepository = props.userRepository;
  }
  async execute(input: CreateUserUseCaseInput): Promise<UserDTO> {
    const { user, id } = input;
    return await this.userRepository.createUser(user, id);
  }
}

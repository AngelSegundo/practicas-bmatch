import { ServiceConnection, ServiceConnectionDTO } from "../../entities";
import { ServiceConnectionRepository } from "../../repositories";

export interface UpdateServiceConnectionUseCaseInput {
  id: string;
  serviceConnection: Partial<ServiceConnection>;
}
export interface UpdateServiceConnectionUseCase {
  execute(
    input: UpdateServiceConnectionUseCaseInput
  ): Promise<ServiceConnectionDTO>;
}

export interface UpdateServiceConnectionUseCaseProps {
  serviceConnectionRepository: ServiceConnectionRepository;
}
export class UpdateServiceConnectionUseCaseImpl
  implements UpdateServiceConnectionUseCase
{
  serviceConnectionRepository: ServiceConnectionRepository;
  constructor(props: UpdateServiceConnectionUseCaseProps) {
    this.serviceConnectionRepository = props.serviceConnectionRepository;
  }

  async execute(
    input: UpdateServiceConnectionUseCaseInput
  ): Promise<ServiceConnectionDTO> {
    const { serviceConnection, id } = input;
    return this.serviceConnectionRepository.updateServiceConnection(
      serviceConnection,
      id
    );
  }
}

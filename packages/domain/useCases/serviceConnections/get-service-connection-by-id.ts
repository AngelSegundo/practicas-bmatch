import { ServiceConnectionDTO } from "../../entities";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";

export interface GetServiceConnectionByIdUseCase {
  execute(id: string): Promise<ServiceConnectionDTO>;
}

export class GetServiceConnectionByIdUseCaseImpl
  implements GetServiceConnectionByIdUseCase
{
  serviceConnectionRepository: ServiceConnectionRepository;
  constructor(serviceConnectionRepository: ServiceConnectionRepository) {
    this.serviceConnectionRepository = serviceConnectionRepository;
  }

  execute(id: string): Promise<ServiceConnectionDTO> {
    return this.serviceConnectionRepository.getServiceConnectionById(id);
  }
}

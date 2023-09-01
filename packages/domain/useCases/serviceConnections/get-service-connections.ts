import { ServiceConnectionDTO } from "../../entities";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";

export interface GetServiceConnectionsUseCase {
  execute(): Promise<ServiceConnectionDTO[]>;
}

export class GetServiceConnectionsUseCaseImpl
  implements GetServiceConnectionsUseCase
{
  serviceConnectionRepository: ServiceConnectionRepository;
  constructor(serviceConnectionRepository: ServiceConnectionRepository) {
    this.serviceConnectionRepository = serviceConnectionRepository;
  }

  async execute(): Promise<ServiceConnectionDTO[]> {
    return this.serviceConnectionRepository.getServicesConnections();
  }
}

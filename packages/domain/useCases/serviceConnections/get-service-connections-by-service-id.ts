import { ServiceConnectionDTO } from "../../entities";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";

export interface GetServiceConnectionsByServiceIdUseCase {
  execute(serviceId: string): Promise<ServiceConnectionDTO[]>;
}
export class GetServiceConnectionsByServiceIdUseCaseImpl
  implements GetServiceConnectionsByServiceIdUseCase
{
  private serviceConnectionRepository: ServiceConnectionRepository;
  constructor(serviceConnectionRepository: ServiceConnectionRepository) {
    this.serviceConnectionRepository = serviceConnectionRepository;
  }
  execute(serviceId: string): Promise<ServiceConnectionDTO[]> {
    return this.serviceConnectionRepository.getServiceConnectionsByServiceId(
      serviceId
    );
  }
}

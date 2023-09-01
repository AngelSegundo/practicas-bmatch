import { ServiceConnectionDTO } from "../../entities";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";

export interface GetServiceConnectionsByUserIdUseCase {
  execute(userId: string): Promise<ServiceConnectionDTO[]>;
}
export class GetServiceConnectionsByUserIdUseCaseImpl
  implements GetServiceConnectionsByUserIdUseCase
{
  private serviceConnectionRepository: ServiceConnectionRepository;
  constructor(serviceConnectionRepository: ServiceConnectionRepository) {
    this.serviceConnectionRepository = serviceConnectionRepository;
  }
  execute(userId: string): Promise<ServiceConnectionDTO[]> {
    return this.serviceConnectionRepository.getServiceConnectionsByUserId(
      userId
    );
  }
}

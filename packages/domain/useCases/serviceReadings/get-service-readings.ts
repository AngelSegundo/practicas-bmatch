import { ServiceReadingDTO } from "../../entities";
import { ServiceReadingRepository } from "../../repositories/service-reading-repository";

export interface GetServiceReadingsUseCase {
  execute(): Promise<ServiceReadingDTO[]>;
}

export class GetServiceReadingsUseCaseImpl
  implements GetServiceReadingsUseCase
{
  serviceReadingRepository: ServiceReadingRepository;
  constructor(serviceReadingRepository: ServiceReadingRepository) {
    this.serviceReadingRepository = serviceReadingRepository;
  }

  async execute(): Promise<ServiceReadingDTO[]> {
    return this.serviceReadingRepository.getServiceReadings();
  }
}

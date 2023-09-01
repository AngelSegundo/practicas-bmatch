import { ServiceReading, ServiceReadingDTO } from "../../entities";
import { ServiceReadingRepository } from "../../repositories";

export interface CreateServiceReadingUseCase {
  execute(data: ServiceReading): Promise<ServiceReadingDTO>;
}

export class CreateServiceReadingUseCaseImpl
  implements CreateServiceReadingUseCase
{
  serviceReadingRepository: ServiceReadingRepository;
  constructor(serviceReadingRepository: ServiceReadingRepository) {
    this.serviceReadingRepository = serviceReadingRepository;
  }

  async execute(data: ServiceReading): Promise<ServiceReadingDTO> {
    const serviceReading =
      await this.serviceReadingRepository.createServiceReading(data);
    return serviceReading;
  }
}

import { ServiceReading, ServiceReadingDTO } from "../../entities";
import {
  ServiceConnectionRepository,
  ServiceReadingRepository,
} from "../../repositories";

export interface InitializeServiceConnectionUseCase {
  execute(serviceReadingData: ServiceReading): Promise<ServiceReadingDTO>;
}

export class InitializeServiceConnectionUseCaseImpl
  implements InitializeServiceConnectionUseCase
{
  private serviceReadingRepository: ServiceReadingRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;

  constructor(
    serviceReadingRepository: ServiceReadingRepository,
    serviceConnectionRepository: ServiceConnectionRepository
  ) {
    this.serviceReadingRepository = serviceReadingRepository;
    this.serviceConnectionRepository = serviceConnectionRepository;
  }

  async execute(
    serviceReadingData: ServiceReading
  ): Promise<ServiceReadingDTO> {
    const serviceReadingDTO =
      await this.serviceReadingRepository.createServiceReading(
        serviceReadingData
      );
    await this.serviceConnectionRepository.activeServiceConnections(
      serviceReadingData.serviceConnectionId
    );
    return serviceReadingDTO;
  }
}

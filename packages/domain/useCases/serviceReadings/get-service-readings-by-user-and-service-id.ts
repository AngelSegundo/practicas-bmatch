import { ServiceReadingDTO } from "../../entities";
import {
  ServiceReadingRepository,
} from "../../repositories";

export interface GetServiceReadingsByServiceConnectionIdUseCase {
  execute(userServiceConnectionId: string): Promise<ServiceReadingDTO[]>;
}

export class GetServiceReadingsByServiceConnectionIdUseCaseImpl
  implements GetServiceReadingsByServiceConnectionIdUseCase
{
  private serviceReadingRepository: ServiceReadingRepository;

  constructor(serviceReadingRepository: ServiceReadingRepository) {
    this.serviceReadingRepository = serviceReadingRepository;
  }

  async execute(serviceConnectionId: string): Promise<ServiceReadingDTO[]> {
    const readings =
      await this.serviceReadingRepository.getServiceReadingsByServiceConnectionId(
        serviceConnectionId
      );
    return readings;
  }
}

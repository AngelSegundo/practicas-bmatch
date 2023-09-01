import {
  ServiceConnectionRepository,
  ServiceReadingRepository,
} from "../../repositories";

export interface DeleteServiceConnectionUseCase {
  execute(id: string): Promise<void>;
}
export class DeleteServiceConnectionUseCaseImpl
  implements DeleteServiceConnectionUseCase
{
  serviceConnectionRepository: ServiceConnectionRepository;
  serviceReadingRepository: ServiceReadingRepository;

  constructor(
    serviceConnectionRepository: ServiceConnectionRepository,
    serviceReadingRepository: ServiceReadingRepository
  ) {
    this.serviceConnectionRepository = serviceConnectionRepository;
    this.serviceReadingRepository = serviceReadingRepository;
  }
  async execute(id: string): Promise<void> {
    const readings =
      await this.serviceReadingRepository.getServiceReadingsByServiceConnectionId(
        id
      );
    await Promise.all(
      readings.map(async (reading) => {
        this.serviceReadingRepository.deleteServiceReading(reading.id);
      })
    );
    return this.serviceConnectionRepository.deleteServiceConnection(id);
  }
}

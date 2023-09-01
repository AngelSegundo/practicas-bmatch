import { INVOICE_BUCKET } from "../../constants";
import { ServiceReadingRepository } from "../../repositories/service-reading-repository";
import { StorageService } from "../../services/storage-service";

export interface GetServiceReadingPDFUseCase {
  execute(id: string, serviceKey: string): Promise<{ data: string | null }>;
}

export class GetServiceReadingPDFUseCaseImpl
  implements GetServiceReadingPDFUseCase
{
  serviceReadingRepository: ServiceReadingRepository;
  storageService: StorageService;
  constructor(
    serviceReadingRepository: ServiceReadingRepository,
    storageService: StorageService
  ) {
    this.serviceReadingRepository = serviceReadingRepository;
    this.storageService = storageService;
  }

  async execute(
    id: string,
    serviceKey: string
  ): Promise<{ data: string | null }> {
    const serviceReading =
      await this.serviceReadingRepository.getServiceReadingById(id);

    if (!serviceReading) {
      throw new Error("ServiceReading not found");
    }

    const signedUrl = await this.storageService.getFileSignedUrl({
      bucket: INVOICE_BUCKET,
      path: `${serviceReading.type}/${serviceKey}/${serviceReading.serviceConnectionId}/${serviceReading.year}/${serviceReading.month}/data.pdf`,
    });

    return {
      data: signedUrl,
    };
  }
}

import { ServiceDTO } from "../../entities";
import { ServiceRepository } from "../../repositories";
import { StorageService } from "../../services";

export interface GetServicesByCountryUseCase {
  execute(countryId: string): Promise<ServiceDTO[]>;
}
export interface GetServicesByCountryUseCaseInput {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
}

export class GetServicesByCountryUseCaseImpl
  implements GetServicesByCountryUseCase
{
  private serviceRepository: ServiceRepository;
  private storageService: StorageService;
  constructor(props: GetServicesByCountryUseCaseInput) {
    this.serviceRepository = props.serviceRepository;
    this.storageService = props.storageService;
  }

  async execute(countryId: string): Promise<ServiceDTO[]> {
    const serviceData = await this.serviceRepository.getServicesByCountry(
      countryId
    );
    const services = await Promise.all(
      serviceData.map(async (service) => {
        if (service.logo) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `services/${service.id}/logo/${service.logo}`,
          });
          service.logo = profilePictureUrl;
        }
        return service;
      })
    );
    return services;
  }
}

import { ServiceDTO } from "../../entities/service";
import { ServiceRepository } from "../../repositories/service-repository";
import { StorageService } from "../../services";

export interface GetServicesUseCase {
  execute(): Promise<ServiceDTO[]>;
}

export interface GetServicesUseCaseInput {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
}

export class GetServicesUseCaseImpl implements GetServicesUseCase {
  private serviceRepository: ServiceRepository;
  private storageService: StorageService;

  constructor(props: GetServicesUseCaseInput) {
    this.serviceRepository = props.serviceRepository;
    this.storageService = props.storageService;
  }
  async execute(): Promise<ServiceDTO[]> {
    const serviceData = await this.serviceRepository.getServices();
    const services = await Promise.all(
      serviceData.map(async (service) => {
        if (service.logo) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `services/${service.id}/logo/${service.logo}`,
          });
          if (service.helperImages && service.helperImages.length > 0) {
            await Promise.all(
              service.helperImages?.map(
                async (helperImage, indexHelperImage) => {
                  const imageUrlSigned =
                    await this.storageService.getFileSignedUrl({
                      bucket: process.env.FILES_BUCKET as string,
                      path: `services/${service.id}/helperImages/${helperImage}`,
                    });
                  if (service.helperImages) {
                    service.helperImages[indexHelperImage] = imageUrlSigned;
                  }
                }
              )
            );
          }
          service.logo = profilePictureUrl;
        }

        //Start: Obtener array de string de los valores de TIPS//
        const serviceTipsValue = service.tips.map((tip) => tip.value);
        service.tipsValue = serviceTipsValue;
        //End: Obtener array de string de los valores de TIPS//
        return service;
      })
    );
    return services;
  }
}

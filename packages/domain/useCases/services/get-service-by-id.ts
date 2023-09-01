import { ServiceDTO } from "../../entities/service";
import { ServiceRepository } from "../../repositories/service-repository";
import { StorageService } from "../../services";

export interface GetServiceByIdUseCase {
  execute(id: string): Promise<ServiceDTO>;
}
export interface GetServiceByIdUseCaseInput {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
}

export class GetServiceByIdUseCaseImpl implements GetServiceByIdUseCase {
  serviceRepository: ServiceRepository;
  private storageService: StorageService;

  constructor(props: GetServiceByIdUseCaseInput) {
    this.serviceRepository = props.serviceRepository;
    this.storageService = props.storageService;
  }

  async execute(id: string): Promise<ServiceDTO> {
    const service = await this.serviceRepository.getServiceById(id);
    if (service && service.logo) {
      const logoUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `services/${id}/logo/${service.logo}`,
      });
      if (service.helperImages?.length > 0) {
        await Promise.all(
          service?.helperImages?.map(async (helperImage, indexHelperImage) => {
            const imageUrlSigned = await this.storageService.getFileSignedUrl({
              bucket: process.env.FILES_BUCKET as string,
              path: `services/${service.id}/helperImages/${helperImage}`,
            });
            if (service.helperImages) {
              service.helperImages[indexHelperImage] = imageUrlSigned;
            }
          })
        );
      }
      service.logo = logoUrl;
    }

    //Start: Obtener array de string de los valores de TIPS//
    const serviceTipsValue = service.tips.map((tip) => tip.value);
    service.tipsValue = serviceTipsValue;
    //End: Obtener array de string de los valores de TIPS//

    return service;
  }
}

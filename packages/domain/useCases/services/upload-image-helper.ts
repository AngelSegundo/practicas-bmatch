import { ServiceDTO } from "../../entities";
import { ServiceRepository } from "../../repositories/service-repository";
import { FileData, StorageService } from "../../services";

export interface UploadHelperImageUseCaseInput {
  file: FileData;
  id: string;
}
export interface UploadHelperImageUseCase {
  execute(input: UploadHelperImageUseCaseInput): Promise<ServiceDTO>;
}

export interface UploadHelperImageUseCaseProps {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
}

export class UploadHelperImageUseCaseImpl implements UploadHelperImageUseCase {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
  constructor(props: UploadHelperImageUseCaseProps) {
    this.serviceRepository = props.serviceRepository;
    this.storageService = props.storageService;
  }

  async execute(input: UploadHelperImageUseCaseInput): Promise<ServiceDTO> {
    const service = await this.serviceRepository.getServiceById(input.id);
    if (service.helperImages === undefined) {
      service.helperImages = [];
    }
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: input.file,
      path: `services/${input.id}/helperImages/`,
      fileName: input.file.filename,
    });
    const updatedService = await this.serviceRepository.updateService(
      {
        helperImages: [...service.helperImages, input.file.filename],
      },
      input.id
    );

    const helperImageUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `services/${input.id}/helperImages/${input.file.filename}`,
    });
    const oldImageUrls = await Promise.all(
      service.helperImages.map(async (imageHelper) => {
        const url = await this.storageService.getFileSignedUrl({
          bucket: process.env.FILES_BUCKET as string,
          path: `services/${input.id}/helperImages/${imageHelper}`,
        });
        return url;
      })
    );

    return {
      ...updatedService,
      helperImages: [...oldImageUrls, helperImageUrl],
    };
  }
}

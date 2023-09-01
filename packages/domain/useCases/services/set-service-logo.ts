import { ServiceDTO } from "../../entities/service";
import { ServiceRepository } from "../../repositories";
import { FileData, StorageService } from "../../services";

export interface SetServiceLogoUseCaseInput {
  id: string;
  logo: FileData;
}
export interface SetServiceLogoUseCase {
  execute(input: SetServiceLogoUseCaseInput): Promise<ServiceDTO>;
}

export interface SetServiceLogoUseCaseProps {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
}

export class SetServiceLogoUseCaseImpl implements SetServiceLogoUseCase {
  serviceRepository: ServiceRepository;
  storageService: StorageService;
  constructor(props: SetServiceLogoUseCaseProps) {
    this.serviceRepository = props.serviceRepository;
    this.storageService = props.storageService;
  }

  async execute(input: SetServiceLogoUseCaseInput): Promise<ServiceDTO> {
    const { id, logo } = input;
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: logo,
      path: `services/${id}/logo/`,
      fileName: logo.filename,
    });
    const updatedService = await this.serviceRepository.updateService(
      {
        logo: logo.filename,
      },
      id
    );

    const logoUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `services/${id}/logo/${updatedService.logo}`,
    });

    return { ...updatedService, logo: logoUrl };
  }
}

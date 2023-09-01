import { Body, Delete, Get, Patch, Path, Post, Put, Query, Route } from "tsoa";
import { Service, ServiceDTO, SERVICE_TABLE_NAME } from "domain/entities";
import { ServiceRepository, ServiceRepositoryImpl } from "domain/repositories";
import {
  CreateServiceUseCaseImpl,
  GetServiceByIdUseCaseImpl,
  GetServicesByCountryUseCaseImpl,
  GetServicesUseCaseImpl,
  SetServiceLogoUseCaseImpl,
  UpdateServiceUseCaseImpl,
  UploadHelperImageUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { FileData, StorageService } from "domain/services";

@Route("services")
export default class ServiceController {
  private serviceRepository: ServiceRepository;
  private storageService: StorageService;
  constructor(database: Database, storageService: StorageService) {
    this.serviceRepository = new ServiceRepositoryImpl(
      new DataSourceImpl<ServiceDTO>(database, SERVICE_TABLE_NAME)
    );
    this.storageService = storageService;
  }
  @Get("/")
  public getServices(@Query() countryId?: string): Promise<ServiceDTO[]> {
    if (countryId) {
      const useCase = new GetServicesByCountryUseCaseImpl({
        serviceRepository: this.serviceRepository,
        storageService: this.storageService,
      });
      return useCase.execute(countryId);
    } else {
      const useCase = new GetServicesUseCaseImpl({
        serviceRepository: this.serviceRepository,
        storageService: this.storageService,
      });
      return useCase.execute();
    }
  }

  @Get("{serviceId}")
  public getById(@Path() serviceId: string): Promise<ServiceDTO> {
    const useCase = new GetServiceByIdUseCaseImpl({
      serviceRepository: this.serviceRepository,
      storageService: this.storageService,
    });
    return useCase.execute(serviceId);
  }

  @Post("/")
  public async createService(@Body() service: Service): Promise<ServiceDTO> {
    const useCreateServiceCase = new CreateServiceUseCaseImpl(
      this.serviceRepository
    );
    const serviceDTO = useCreateServiceCase.execute(service);
    return serviceDTO;
  }

  @Patch("{serviceId}")
  public update(
    @Path() serviceId: string,
    data: Partial<Service>
  ): Promise<ServiceDTO> {
    const useCase = new UpdateServiceUseCaseImpl(this.serviceRepository);
    return useCase.execute({ id: serviceId, data });
  }

  @Put("/{id}/logo")
  public updateServiceLogo(
    @Body() logo: FileData,
    @Path() id: string
  ): Promise<ServiceDTO> {
    const useCase = new SetServiceLogoUseCaseImpl({
      serviceRepository: this.serviceRepository,
      storageService: this.storageService,
    });
    const serviceDTO = useCase.execute({ logo, id });
    return serviceDTO;
  }

  @Put("/{id}/helperImage")
  public uploadImageHelper(
    @Body() file: FileData,
    @Path() id: string    
  ): Promise<ServiceDTO> {
    const useCase = new UploadHelperImageUseCaseImpl({
      serviceRepository: this.serviceRepository,
      storageService: this.storageService,
    });

    return useCase.execute({
      file: file,
      id: id,
    });
  }

  @Delete("/{id}/helperImage/{index}")
  public async deleteHelperImage(
    id: string,
    index: number
  ): Promise<ServiceDTO> {
    const service = await this.serviceRepository.getServiceById(id);

    if (!service) {
      throw new Error("Service not found");
    }

    if (!service.helperImages) {
      throw new Error("Service has no helper images");
    }

    if (index >= service.helperImages.length) {
      throw new Error("Index out of bounds");
    }

    const newHelperImages = service.helperImages.filter((_, i) => i !== index);

    const useCase = new UpdateServiceUseCaseImpl(this.serviceRepository);

    return useCase.execute({
      id: id,
      data: {
        helperImages: newHelperImages,
      },
    });
  }
}

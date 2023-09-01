import { Get, Path, Query, Route } from "tsoa";
import { ServiceDTO, SERVICE_TABLE_NAME } from "domain/entities";
import { ServiceRepository, ServiceRepositoryImpl } from "domain/repositories";
import {
  GetServiceByIdUseCaseImpl,
  GetServicesByCountryUseCaseImpl,
  GetServicesUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { StorageService } from "domain/services";

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
}

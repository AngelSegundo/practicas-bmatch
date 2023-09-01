import { Body, Get, Patch, Post, Query, Route } from "tsoa";
import {
  ServiceConnectionDTO,
  ServiceReading,
  ServiceReadingDTO,
  SERVICE_CONNECTION_TABLE_NAME,
  SERVICE_READING_TABLE_NAME,
} from "domain/entities";
import {
  ServiceConnectionRepository,
  ServiceConnectionRepositoryImpl,
  ServiceReadingRepository,
  ServiceReadingRepositoryImpl,
} from "domain/repositories";
import {
  CreateServiceReadingUseCaseImpl,
  ChangeServiceReadingValueUseCaseImpl,
  GetServiceReadingsByServiceConnectionIdUseCaseImpl,
  GetServiceReadingsUseCaseImpl,
  GetServiceReadingPDFUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { StorageService } from "domain/services";

@Route("service-readings")
export default class ServiceReadingController {
  private serviceReadingRepository: ServiceReadingRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;
  private storageService: StorageService;

  constructor(database: Database, storageService: StorageService) {
    this.serviceReadingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
    this.serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
    this.storageService = storageService;
  }
  @Get("/")
  public getServiceReadingsByServiceConnectionId(
    @Query() connectionId: string
  ): Promise<ServiceReadingDTO[]> {
    const useCase = new GetServiceReadingsByServiceConnectionIdUseCaseImpl(
      this.serviceReadingRepository
    );
    return useCase.execute(connectionId);
  }

  @Post("{serviceConnectionId}")
  public createServiceReading(
    @Body() serviceReading: ServiceReading
  ): Promise<ServiceReadingDTO> {
    const useCase = new CreateServiceReadingUseCaseImpl(
      this.serviceReadingRepository
    );
    return useCase.execute({
      ...serviceReading,
    });
  }

  @Get("/pdf")
  public getServiceReadingPdf(
    @Query() serviceReadingId: string,
    @Query() serviceKey: string
  ): Promise<{ data: string | null }> {
    const useCase = new GetServiceReadingPDFUseCaseImpl(
      this.serviceReadingRepository,
      this.storageService
    );
    return useCase.execute(serviceReadingId, serviceKey);
  }

  @Patch("{serviceReadingId}")
  public changeServiceReadingValue(
    @Body() value: number,
    @Query() serviceReadingId: string
  ): Promise<ServiceReadingDTO> {
    const useCase = new ChangeServiceReadingValueUseCaseImpl(
      this.serviceReadingRepository
    );
    return useCase.execute({ value, id: serviceReadingId });
  }
}

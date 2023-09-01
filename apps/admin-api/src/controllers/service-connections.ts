import { Body, Delete, Get, Path, Post, Query, Route } from "tsoa";
import {
  ServiceConnection,
  ServiceConnectionDTO,
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
  CreateServiceConnectionUseCaseImpl,
  GetServiceConnectionsByUserIdUseCaseImpl,
  GetServiceConnectionsByServiceIdUseCaseImpl,
  GetServiceConnectionsUseCaseImpl,
  GetServiceConnectionByIdUseCaseImpl,
  DeleteServiceConnectionUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";

@Route("service-connections")
export default class ServiceController {
  private serviceConnectionRepository: ServiceConnectionRepository;
  private serviceReadingRepository: ServiceReadingRepository;

  constructor(database: Database) {
    this.serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
    this.serviceReadingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
  }
  //tenemos que comprobar que solo creamos si no hay ya uno con ese UserId y ese serviceId
  @Post("/")
  public createServiceConnection(
    @Body() serviceConnection: ServiceConnection
  ): Promise<ServiceConnectionDTO> {
    const useCase = new CreateServiceConnectionUseCaseImpl(
      this.serviceConnectionRepository
    );
    return useCase.execute(serviceConnection);
  }
  @Get("/")
  public getServiceConnections(
    @Query() userId?: string,
    @Query() serviceId?: string
  ): Promise<ServiceConnectionDTO[]> {
    if (userId) {
      const useCase = new GetServiceConnectionsByUserIdUseCaseImpl(
        this.serviceConnectionRepository
      );
      return useCase.execute(userId);
    }
    if (serviceId) {
      const useCase = new GetServiceConnectionsByServiceIdUseCaseImpl(
        this.serviceConnectionRepository
      );
      return useCase.execute(serviceId);
    } else {
      const useCase = new GetServiceConnectionsUseCaseImpl(
        this.serviceConnectionRepository
      );
      return useCase.execute();
    }
  }
  @Get("{serviceConnectionId}")
  public getById(
    @Path() serviceConnectionId: string
  ): Promise<ServiceConnectionDTO> {
    const useCase = new GetServiceConnectionByIdUseCaseImpl(
      this.serviceConnectionRepository
    );
    return useCase.execute(serviceConnectionId);
  }
  @Delete("{id}")
  public deleteById(@Path() id: string): Promise<void> {
    const useCase = new DeleteServiceConnectionUseCaseImpl(
      this.serviceConnectionRepository,
      this.serviceReadingRepository
    );
    return useCase.execute(id);
  }
}

import { DataSource, QuerySearchTypes } from "../interfaces";
import {
  ServiceConnection,
  ServiceConnectionDTO,
  ServiceConnectionStatus,
  SERVICE_CONNECTION_ID_PREFIX,
} from "../entities";
import { generateKsuid } from "../utilities/ids";

export interface ServiceConnectionRepository {
  createServiceConnection(
    data: ServiceConnection
  ): Promise<ServiceConnectionDTO>;
  getServicesConnections(): Promise<ServiceConnectionDTO[]>;
  getServiceConnectionById(id: string): Promise<ServiceConnectionDTO>;
  getServiceConnectionsByUserId(
    userId: string
  ): Promise<ServiceConnectionDTO[]>;
  
  getServiceConnectionsByServiceId(
    serviceId: string
  ): Promise<ServiceConnectionDTO[]>;
  
  activeServiceConnections(id: string): Promise<ServiceConnectionDTO>;
  
  updateServiceConnection(
    data: Partial<ServiceConnection>,
    id: string
  ): Promise<ServiceConnectionDTO>;
  deleteServiceConnection(id: string): Promise<void>;
}
export class ServiceConnectionRepositoryImpl
  implements ServiceConnectionRepository
{
  dataSource: DataSource<ServiceConnectionDTO>;
  constructor(dataSource: DataSource<ServiceConnectionDTO>) {
    this.dataSource = dataSource;
  }
  createServiceConnection(
    data: ServiceConnection
  ): Promise<ServiceConnectionDTO> {
    const datetime = new Date().toISOString();
    const serviceConnection = {
      ...data,
      id: generateKsuid(SERVICE_CONNECTION_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as ServiceConnectionDTO;
    return this.dataSource.create(serviceConnection);
  }
  getServicesConnections(): Promise<ServiceConnectionDTO[]> {
    return this.dataSource.getAll();
  }

  getServiceConnectionById(id: string): Promise<ServiceConnectionDTO> {
    return this.dataSource.getById(id);
  }
  getServiceConnectionsByUserId(
    userId: string
  ): Promise<ServiceConnectionDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "userId",
        searchType: QuerySearchTypes.EQUALS,
        value: userId,
      },
    ]);
  }
  getServiceConnectionsByServiceId(
    serviceId: string
  ): Promise<ServiceConnectionDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "serviceId",
        searchType: QuerySearchTypes.EQUALS,
        value: serviceId,
      },
    ]);
  }
  async activeServiceConnections(id: string): Promise<ServiceConnectionDTO> {
    const updatedAt = new Date().toISOString();
    const status = ServiceConnectionStatus.active;
    const serviceConnection = {
      status: status,
      updatedAt: updatedAt,
    } as Partial<ServiceConnectionDTO>;
    return this.dataSource.update(id, serviceConnection);
  }
  async updateServiceConnection(
    data: Partial<ServiceConnection>,
    id: string
  ): Promise<ServiceConnectionDTO> {
    const datetime = new Date().toISOString();
    const serviceConnection = data as Partial<ServiceConnectionDTO>;
    serviceConnection.updatedAt = datetime;
    return this.dataSource.update(id, serviceConnection);
  }
  deleteServiceConnection(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}

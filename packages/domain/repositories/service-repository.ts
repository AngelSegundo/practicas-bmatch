import { DataSource, QuerySearchTypes } from "../interfaces";
import { Service, ServiceDTO, SERVICE_ID_PREFIX } from "../entities";
import { generateKsuid } from "../utilities/ids";

export interface ServiceRepository {
  getServices(): Promise<ServiceDTO[]>;
  getServiceById(id: string): Promise<ServiceDTO>;
  getServicesByCountry(countryId: string): Promise<ServiceDTO[]>;
  getServicesByCountry(countryId: string): Promise<ServiceDTO[]>;
  createService(data: Service): Promise<ServiceDTO>;
  updateService(data: Partial<Service>, id: string): Promise<ServiceDTO>;
}

export class ServiceRepositoryImpl implements ServiceRepository {
  dataSource: DataSource<ServiceDTO>;
  constructor(dataSource: DataSource<ServiceDTO>) {
    this.dataSource = dataSource;
  }

  getServices(): Promise<ServiceDTO[]> {
    return this.dataSource.getAll();
  }

  getServiceById(id: string): Promise<ServiceDTO> {
    return this.dataSource.getById(id);
  }
  getServicesByCountry(countryId: string): Promise<ServiceDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "countryId",
        searchType: QuerySearchTypes.EQUALS,
        value: countryId,
      },
    ]);
  }
  async createService(data: Service): Promise<ServiceDTO> {
    const datetime = new Date().toISOString();
    const service = {
      ...data,
      id: generateKsuid(SERVICE_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as ServiceDTO;
    return this.dataSource.create(service);
  }
  async updateService(data: Partial<Service>, id: string): Promise<ServiceDTO> {
    const datetime = new Date().toISOString();
    const service = data as Partial<ServiceDTO>;
    service.updatedAt = datetime;
    return this.dataSource.update(id, service);
  }
}

import { DataSource, QuerySearchTypes } from "../interfaces";
import {
  ServiceReading,
  ServiceReadingDTO,
  SERVICE_READING_ID_PREFIX,
} from "../entities";
import { generateKsuid } from "../utilities/ids";

export interface ServiceReadingRepository {
  getServiceReadings(): Promise<ServiceReadingDTO[]>;
  getServiceReadingById(id: string): Promise<ServiceReadingDTO>;
  getServiceReadingsByServiceConnectionId(
    serviceConnectionId: string
  ): Promise<ServiceReadingDTO[]>;
  createServiceReading(data: ServiceReading): Promise<ServiceReadingDTO>;
  changeServiceReadingValue(
    value: number,
    id: string
  ): Promise<ServiceReadingDTO>;
  getLastsYearUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]>;
  getLastsTwoMonthsUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]>;
  // JOSE ARDILES 05-04-23 INIT
  getLastsSixMonthsUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]>;
  // JOSE ARDILES 05-04-23 FIN
  getServiceReadingByYearAndMonth(
    serviceConnectionId: string,
    month: string,
    year: string
  ): Promise<ServiceReadingDTO[]>;
  getServiceReadingByYearAndMonthByUserId(query: {
    userId: string;
    month: string;
    year: string;
  }): Promise<ServiceReadingDTO[]>;
  deleteServiceReading(id: string): Promise<void>;
}

export class ServiceReadingRepositoryImpl implements ServiceReadingRepository {
  dataSource: DataSource<ServiceReadingDTO>;
  constructor(dataSource: DataSource<ServiceReadingDTO>) {
    this.dataSource = dataSource;
  }
  getServiceReadings(): Promise<ServiceReadingDTO[]> {
    return this.dataSource.getAll();
  }

  getServiceReadingById(id: string): Promise<ServiceReadingDTO> {
    return this.dataSource.getById(id);
  }

  getServiceReadingsByServiceConnectionId(
    serviceConnectionId: string
  ): Promise<ServiceReadingDTO[]> {
    const now = new Date();
    const year = now.getFullYear() - 1;
    const readings = this.dataSource.find([
      {
        fieldName: "serviceConnectionId",
        searchType: QuerySearchTypes.EQUALS,
        value: serviceConnectionId,
      },
      {
        fieldName: "readingDate",
        searchType: QuerySearchTypes.GREATER_THAN_EQUALS,
        value: year.toString(),
      },
    ]);
    return readings;
  }
  getServiceReadingByYearAndMonth(
    serviceConnectionId: string,
    month: string,
    year: string
  ): Promise<ServiceReadingDTO[]> {
    const readings = this.dataSource.find([
      {
        fieldName: "serviceConnectionId",
        searchType: QuerySearchTypes.EQUALS,
        value: serviceConnectionId,
      },
      {
        fieldName: "month",
        searchType: QuerySearchTypes.EQUALS,
        value: month,
      },
      {
        fieldName: "year",
        searchType: QuerySearchTypes.EQUALS,
        value: year,
      },
    ]);
    return readings;
  }
  getServiceReadingByYearAndMonthByUserId(query: {
    userId: string;
    month: string;
    year: string;
  }): Promise<ServiceReadingDTO[]> {
    const { userId, month, year } = query;
    const readings = this.dataSource.find([
      {
        fieldName: "userId",
        searchType: QuerySearchTypes.EQUALS,
        value: userId,
      },
      {
        fieldName: "month",
        searchType: QuerySearchTypes.EQUALS,
        value: month,
      },
      {
        fieldName: "year",
        searchType: QuerySearchTypes.EQUALS,
        value: year,
      },
    ]);
    return readings;
  }
  getLastsYearUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]> {
    const now = new Date();
    const year = now.getFullYear() - 1;
    const month = now.getMonth() + 1 + 1;
    const monthToString = month < 10 ? `0${month}` : month;
    const fromDateTostring = `${year}-${monthToString}`;
    const readings = this.dataSource.find([
      {
        fieldName: "userId",
        searchType: QuerySearchTypes.EQUALS,
        value: userId,
      },
      {
        fieldName: "readingDate",
        searchType: QuerySearchTypes.GREATER_THAN_EQUALS,
        value: fromDateTostring,
      },
    ]);
    return readings;
  }
  getLastsTwoMonthsUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]> {
    const date = new Date();
    const twoMonthAgoDate = new Date(date.setMonth(date.getMonth() - 2));

    const readings = this.dataSource.find([
      {
        fieldName: "userId",
        searchType: QuerySearchTypes.EQUALS,
        value: userId,
      },
      {
        fieldName: "readingDate",
        searchType: QuerySearchTypes.GREATER_THAN_EQUALS,
        value: twoMonthAgoDate.toISOString(),
      },
    ]);
    return readings;
  }
  // JOSE ARDILES 05-04-23 INIT
  getLastsSixMonthsUserServicesReadings(
    userId: string
  ): Promise<ServiceReadingDTO[]> {
    const date = new Date();
    const twoMonthAgoDate = new Date(date.setMonth(date.getMonth() - 6));

    const readings = this.dataSource.find([
      {
        fieldName: "userId",
        searchType: QuerySearchTypes.EQUALS,
        value: userId,
      },
      {
        fieldName: "readingDate",
        searchType: QuerySearchTypes.GREATER_THAN_EQUALS,
        value: twoMonthAgoDate.toISOString(),
      },
    ]);
    return readings;
  }
    // JOSE ARDILES 05-04-23 END
  createServiceReading(data: ServiceReading): Promise<ServiceReadingDTO> {
    const datetime = new Date().toISOString();
    const reading = {
      ...data,
      id: generateKsuid(SERVICE_READING_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as ServiceReadingDTO;
    return this.dataSource.create(reading);
  }
  async changeServiceReadingValue(
    value: number,
    id: string
  ): Promise<ServiceReadingDTO> {
    const updatedAt = new Date().toISOString();
    const serviceReading = {
      value: value,
      updatedAt: updatedAt,
    } as Partial<ServiceReadingDTO>;
    return this.dataSource.update(id, serviceReading);
  }
  deleteServiceReading(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}

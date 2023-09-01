import { ServiceType } from "./service";
import { ServiceConnectionStatus } from "./service-connection";

export interface ReadingData {
  readingId: string;
  readingDate: string;
  value: number;
  unit: string;
  scrapperInstance?: string;
}
export type ServiceConnectionDetailed = {
  countryId: string;
  serviceId: string;
  serviceName?: string;
  serviceLogo?: string;
  type: ServiceType;
  serviceConnectionId: string;
  alias: string;
  status: ServiceConnectionStatus;
  last6readings: ReadingData[];
  savingValue: number;
  unit: string;
  savingMessage: string;
};

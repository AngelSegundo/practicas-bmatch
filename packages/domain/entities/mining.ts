import { ServiceType } from "./service";

export interface MiningInput {
  month: string;
  year: string;
  serviceConnectionId: string;
  serviceType: ServiceType;
  serviceKey: string;
}

export interface MiningDate {
  month: string;
  year: string;
  value?: number;
  date?: string;
}

export interface MiningRequest {
  month: string;
  year: string;
  serviceConnectionId: string;
  serviceKey: string;
  value?: number;
  date?: string;
}

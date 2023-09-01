import { MiningRequest } from "../entities";

export interface ScrapperServiceInput {
  serviceKey: string;
  serviceConnectionId: string;
  isInitial?: boolean;
}

export interface ScrapperService {
  scrap(props: ScrapperServiceInput): Promise<MiningRequest[]>;
}

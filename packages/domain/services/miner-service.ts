import { MiningRequest, ServiceReadingDTO } from "../entities";

export interface MinerServiceInput {
  serviceKey: string;
  serviceConnectionId: string;
  month: string;
  year: string;
}

export interface MinerService {
  mine(props: MiningRequest): Promise<ServiceReadingDTO>;
}

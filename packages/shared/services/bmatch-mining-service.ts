import https from "https";
import axios, { AxiosInstance } from "axios";
import { MiningRequest, ServiceReadingDTO } from "domain/entities";
import { MinerService } from "domain/services";

export class BmatchMiningServices implements MinerService {
  private client: AxiosInstance;

  constructor({ url }: { url: string }) {
    this.client = axios.create({
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: url + "/miners/",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async mine(props: MiningRequest): Promise<ServiceReadingDTO> {
    const { serviceConnectionId, serviceKey, month, year, value, date } = props;

    const { data } = await this.client.post<ServiceReadingDTO>(
      `/${serviceKey}`,
      {
        serviceConnectionId,
        month,
        year,
        value,
        date,
      }
    );

    return data;
  }
}

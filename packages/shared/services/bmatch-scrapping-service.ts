import https from "https";
import axios, { AxiosInstance } from "axios";
import { MiningRequest } from "domain/entities";
import { ScrapperService, ScrapperServiceInput } from "domain/services";

export class BmatchScrappingServices implements ScrapperService {
  private client: AxiosInstance;

  constructor({ url }: { url: string }) {
    this.client = axios.create({
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: url + "/scrapper/",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async scrap(props: ScrapperServiceInput): Promise<MiningRequest[]> {
    const { serviceKey, serviceConnectionId } = props;

    const { data } = await this.client.post<MiningRequest[]>(`/${serviceKey}`, {
      serviceConnectionId,
    });

    return data;
  }
}

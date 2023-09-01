import { ServiceReadingDTO } from "../../entities";
import {
  ServiceConnectionRepository,
} from "../../repositories";
import { MinerService, ScrapperService } from "../../services";

export interface GetServiceConnectionNewReadingsInput {
  serviceConnectionId: string;
}

export interface GetServiceConnectionNewReadingsProps {
  serviceConnectionRepository: ServiceConnectionRepository;
  miningService: MinerService;
  scrapperService: ScrapperService;
}

export interface GetServiceConnectionNewReadings {
  execute(
    input: GetServiceConnectionNewReadingsInput
  ): Promise<ServiceReadingDTO[]>;
}

export class GetServiceConnectionNewReadingsImpl
  implements GetServiceConnectionNewReadings
{
  private serviceConnectionRepository: ServiceConnectionRepository;
  private miningService: MinerService;
  private scrapperService: ScrapperService;

  constructor({
    serviceConnectionRepository,
    miningService,
    scrapperService,
  }: GetServiceConnectionNewReadingsProps) {
    this.serviceConnectionRepository = serviceConnectionRepository;
    this.miningService = miningService;
    this.scrapperService = scrapperService;
  }

  async execute({
    serviceConnectionId,
  }: GetServiceConnectionNewReadingsInput): Promise<ServiceReadingDTO[]> {
    const serviceConnection =
      await this.serviceConnectionRepository.getServiceConnectionById(
        serviceConnectionId
      );

    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    if (!serviceConnection.serviceKey) {
      throw new Error("Service connection has no service key");
    }

    const miningRequests = await this.scrapperService.scrap({
      serviceKey: serviceConnection.serviceKey,
      serviceConnectionId: serviceConnection.id,
    });

    if (miningRequests.length === 0) {
      throw new Error("No mining requests");
    }

    const miningResults = await Promise.all(
      miningRequests.map((miningRequest) =>
        this.miningService.mine(miningRequest)
      )
    );

    return miningResults;
  }
}

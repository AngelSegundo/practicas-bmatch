import { ServiceReadingDTO, ServiceType } from "../../entities";
import { Savings } from "../../entities/saving";
import {
  ServiceReadingRepository,
  ServiceConnectionRepository,
} from "../../repositories";
import { calculateSaving } from "../../utilities/saving-calculation";

export interface GetSavingsByUserIdUseCase {
  execute(userId: string): Promise<{ savings: Savings }>;
}
export class GetSavingsByUserIdUseCaseImpl
  implements GetSavingsByUserIdUseCase
{
  private serviceReadingRepository: ServiceReadingRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;
  constructor(
    serviceReadingRepository: ServiceReadingRepository,
    serviceConnectionRepository: ServiceConnectionRepository
  ) {
    this.serviceReadingRepository = serviceReadingRepository;
    this.serviceConnectionRepository = serviceConnectionRepository;
  }

  async execute(userId: string): Promise<{ savings: Savings }> {
    const connections =
      await this.serviceConnectionRepository.getServiceConnectionsByUserId(
        userId
      );
    const activeConnections = connections.filter(
      (conection) => conection.status === "active"
    );
    const readings =
      await this.serviceReadingRepository.getLastsYearUserServicesReadings(
        userId
      );

    const activeReadings = readings.filter((reading) =>
      activeConnections.find(
        (conection) => conection.id === reading.serviceConnectionId
      )
    );

    const savings: Savings = activeReadings.reduce(
      (savingByConnectionsAcc: any, currentReading: ServiceReadingDTO) => {
        if (currentReading.value === null || currentReading === undefined)
          return savingByConnectionsAcc;
        const connectionId = currentReading.serviceConnectionId;
        /*De momento trae los readings ordenados por readingDate. Si lo dejase de hacer, habría que meter un .sort*/
        const last2MonthsReadings = activeReadings
          .filter(
            (reading) =>
              connectionId === reading.serviceConnectionId &&
              reading.value !== null
          )
          .slice(-2);
        const saving = calculateSaving(last2MonthsReadings);
        savingByConnectionsAcc[connectionId] = {
          connectionId: saving.connectionId,
          value: saving.value,
          unit: saving.unit,
          type: saving.type,
        };
        return savingByConnectionsAcc;
      },
      {} as {
        [key: string]: {
          connectionId: string;
          value: number;
          unit: string;
          type: ServiceType;
        };
      }
    );

    return { savings };
  }
}

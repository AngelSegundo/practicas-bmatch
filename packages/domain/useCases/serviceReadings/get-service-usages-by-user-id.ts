import { ServiceType } from "../../entities";
import { Usage } from "../../entities/usage";
import { ServiceReadingRepository, ServiceConnectionRepository } from "../../repositories";

export interface GetUsagesByUserIdUseCase {
  execute(userId: string): Promise<{ usages: Usage }>;
}
export class GetUsagesByUserIdUseCaseImpl implements GetUsagesByUserIdUseCase {
  private serviceReadingRepository: ServiceReadingRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;
  constructor(
    serviceReadingRepository: ServiceReadingRepository,
    serviceConnectionRepository: ServiceConnectionRepository
  ) {
    this.serviceReadingRepository = serviceReadingRepository;
    this.serviceConnectionRepository = serviceConnectionRepository;
  }
  async execute(userId: string): Promise<{ usages: Usage }> {
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

    const allUsages: any = activeReadings.reduce(
      (usagesAcc, currentReading) => {
        if (currentReading.value === null || currentReading.value === undefined)
          return usagesAcc;
        const [year, month] = currentReading.readingDate
          .split("T")[0]
          .split("-");
        const dateId = `${year}_${month}`;

        if (usagesAcc[currentReading.type][dateId]) {
          usagesAcc[currentReading.type][dateId].value =
            usagesAcc[currentReading.type][dateId].value + currentReading.value;
        } else {
          usagesAcc[currentReading.type] = {
            ...usagesAcc[currentReading.type],
            [dateId]: {
              month: month,
              year: year,
              value: currentReading.value,
              unit: currentReading.unit,
            } as { [key: string]: any },
          };
        }

        return usagesAcc;
      },
      {
        water: {},
        gas: {},
        electricity: {},
      } as any
    );
    const usages: Usage = Object.keys(allUsages).reduce(
      (usagesResult, serviceTypeKey) => {
        usagesResult[serviceTypeKey as ServiceType] = Object.values(
          allUsages[serviceTypeKey]
        );
        return usagesResult;
      },
      {} as Usage
    );
    const waterValues = usages.water.map((usage) => usage.value);
    const electricityValues = usages.electricity.map((usage) => usage.value);
    const gasValues = usages.gas.map((usage) => usage.value);
    //TODO: refactorizar esto
    const maxWater = Math.max(...waterValues);
    const minWater = Math.min(...waterValues);
    const maxElectricity = Math.max(...electricityValues);
    const minElectricity = Math.min(...electricityValues);
    const maxGas = Math.max(...gasValues);
    const minGas = Math.min(...gasValues);

    const normalizedWaterUsages = usages.water.map((usage) => {
      return {
        ...usage,
        normalizedValue:
          usages.water.length <= 1
            ? 50
            : ((usage.value - minWater) / (maxWater - minWater)) * 100,
      };
    });
    const normalizedElectricityUsages = usages.electricity.map((usage) => {
      return {
        ...usage,
        normalizedValue:
          usages.electricity.length <= 1
            ? 50
            : ((usage.value - minElectricity) /
                (maxElectricity - minElectricity)) *
              100,
      };
    });
    const normalizeGasUsages = usages.gas.map((usage) => {
      return {
        ...usage,
        normalizedValue:
          usages.gas.length <= 1
            ? 50
            : ((usage.value - minGas) / (maxGas - minGas)) * 100,
      };
    });
    const normalizedUsages = {
      water: normalizedWaterUsages,
      electricity: normalizedElectricityUsages,
      gas: normalizeGasUsages,
    } as Usage;
    return { usages: normalizedUsages };
  }
}

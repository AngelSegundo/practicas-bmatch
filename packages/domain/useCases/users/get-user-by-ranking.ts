import { array, TypeOf } from "zod";
import { RankingDTO, ServiceReading, ServiceType } from "../../entities";
import {
  UserRepository,
  RankingRepository,
  ServiceReadingRepository,
} from "../../repositories";
import { calculateSaving } from "../../utilities/saving-calculation";

export interface GetUserRankingUseCaseInput {
  userRepository: UserRepository;
}

export interface GetUserRankingUseCase {
  execute(): Promise<RankingDTO[]>;
}

export class GetUserRankingUseCaseImpl implements GetUserRankingUseCase {
  private userRepository: UserRepository;
  private rankingRepository: RankingRepository;
  private serviceReadingRepository: ServiceReadingRepository;

  constructor(
    userRepository: UserRepository,
    rankingRepository: RankingRepository,
    serviceReadingRepository: ServiceReadingRepository
  ) {
    this.userRepository = userRepository;
    this.rankingRepository = rankingRepository;
    this.serviceReadingRepository = serviceReadingRepository;
  }

  async execute(query?: {
    month: string;
    year: string;
  }): Promise<RankingDTO[]> {
    const users = await this.userRepository.getUsers();
    const date = new Date();

    await Promise.all(
      users.map(async (user) => {
        let readings: ServiceReading[] = [];
        if (query?.month && query.year) {
          const readingsAfter: Promise<ServiceReading[]> = new Promise(
            (resolve, reject) => {
              this.serviceReadingRepository
                .getServiceReadingByYearAndMonthByUserId({
                  userId: user.id,
                  month: query.month,
                  year: query.year,
                })
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            }
          );
          const readingsNow: Promise<ServiceReading[]> = new Promise(
            (resolve, reject) => {
              this.serviceReadingRepository
                .getServiceReadingByYearAndMonthByUserId({
                  userId: user.id,
                  month: (query.month === "01"
                    ? "12"
                    : Number(query.month) - 1
                  ).toString(),
                  year: (query.month === "01"
                    ? (Number(query.year) - 1).toString()
                    : query.year
                  ).toString(),
                })
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            }
          );
          readings = await Promise.all([readingsAfter, readingsNow]).then(
            (data) => {
              return data.flat();
            }
          );
        } else {
          readings = await this.serviceReadingRepository
            .getLastsTwoMonthsUserServicesReadings(user.id)
            .then((reading) => {
              return reading;
            });
        }
        let previous_ranking = 0;
        const rankingsUserId = await this.rankingRepository.getRankingsByUserId(
          user.id
        );
        if (rankingsUserId.length > 0) {
          previous_ranking = rankingsUserId[rankingsUserId.length - 1].ranking;
        }
        const savingsType: {
          [key in ServiceType]: ServiceReading[];
        } = { water: [], gas: [], electricity: [], freeway: [] };
        readings.forEach((reading) => {
          savingsType[reading.type]?.push(reading);
        });
        const savings: Promise<{ type: ServiceType; value: number }[]> =
          Promise.all(
            Object.values(savingsType).map(
              async (savingsArray: ServiceReading[] | []) => {
                let savingsObject = {
                  value: 0,
                  unit: "mt",
                  type: ServiceType.freeway,
                  connectionId: "",
                };
                if (savingsArray.length > 0) {
                  savingsObject = await calculateSaving(savingsArray);
                }
                return {
                  type: savingsArray[0]?.type ?? "",
                  value: savingsObject.value,
                };
              }
            )
          );
        const allSavings: number = (await savings).reduce(
          (allSavings, currentSaving) => allSavings + currentSaving.value,
          0
        );

        const savingByType = async (type: ServiceType) => {
          return (await savings).reduce((allSavings, currentSaving) => {
            if (currentSaving.type === type) {
              return allSavings + currentSaving.value;
            }
            return allSavings;
          }, 0);
        };
        const savingType: {
          electricity: number;
          gas: number;
          water: number;
          freeway: number;
        } = {
          electricity: await savingByType(ServiceType.electricity),
          gas: await savingByType(ServiceType.gas),
          water: await savingByType(ServiceType.water),
          freeway: await savingByType(ServiceType.freeway),
        };
        await this.rankingRepository.createRanking({
          userId: user.id,
          month: query?.month ? query.month : date.getMonth().toString(),
          year: query?.year ? query.year : date.getFullYear().toString(),
          savings: allSavings,
          savings_electricity: savingType.electricity,
          savings_freeway: savingType.freeway,
          savings_gas: savingType.gas,
          savings_water: savingType.water,
          ranking: previous_ranking,
          previous_ranking: previous_ranking,
        });
      })
    );
    const rankingOrdered: Promise<RankingDTO[]> = Promise.all(
      users.map(async (user) => {
        const rankingsUser = (
          await this.rankingRepository.getRankingsByUserId(user.id)
        ).sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        return rankingsUser[0];
      })
    );
    const rankingsOrdered = Promise.all(
      (await rankingOrdered)
        .sort((a, b) => b.savings - a.savings)
        .map((rankingAfter, rankingIndexOrder) => {
          this.userRepository.updateUser(
            {
              scoring: {
                currentRanking: rankingIndexOrder + 1,
                previousRanking: rankingAfter.previous_ranking,
                currentRankingId: rankingAfter.id,
                savings: rankingAfter.savings,
              },
            },
            rankingAfter.userId
          );
          return this.rankingRepository.updateRanking(
            {
              ...rankingAfter,
              ranking: rankingIndexOrder + 1,
              previous_ranking: rankingAfter.previous_ranking,
            },
            rankingAfter.id
          );
        })
    );
    return rankingsOrdered;
  }
}

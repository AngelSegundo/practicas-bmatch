import {
  CommunityDetailed,
  ServiceReadingDTO,
  ServiceType,
  UserRankingData,
} from "../../entities";
import { Savings } from "../../entities/saving";
import {
  CommunityRepository,
  ServiceReadingRepository,
  ServiceRepository,
  UserRepository,
} from "../../repositories";
import { StorageService } from "../../services";
import { calculateSaving } from "../../utilities/saving-calculation";

export interface GetCommunityDetailedByIdUseCase {
  execute(id: string): Promise<CommunityDetailed>;
}

export class GetCommunityDetailedByIdUseCaseImpl
  implements GetCommunityDetailedByIdUseCase
{
  private communityRepository: CommunityRepository;
  private serviceReadingRepository: ServiceReadingRepository;
  private userRepository: UserRepository;
  private serviceRepository: ServiceRepository;
  private storageService: StorageService;

  constructor(
    communityRepository: CommunityRepository,
    serviceReadingRepository: ServiceReadingRepository,
    userRepository: UserRepository,
    serviceRepository: ServiceRepository,
    storageService: StorageService
  ) {
    this.communityRepository = communityRepository;
    this.serviceReadingRepository = serviceReadingRepository;
    this.userRepository = userRepository;
    this.serviceRepository = serviceRepository;
    this.storageService = storageService;
  }

  async execute(id: string): Promise<CommunityDetailed> {
    function compareAsc(a: any, b: any) {
      if (a.globalSaving < b.globalSaving) {
        return -1;
      }
      if (a.globalSaving > b.globalSaving) {
        return 1;
      }
      return 0;
    }
    const community = await this.communityRepository.getCommunityById(id);
    if (community && community.profilePicture) {
      const profilePictureUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `communities/${id}/profile-picture/${community.profilePicture}`,
      });
      community.profilePicture = profilePictureUrl;
    }
    const usersData = (
      await this.userRepository.getUsersByCommunityId(id)
    ).sort((a, b) => {
      if (a.scoring && b.scoring) {
        return a.scoring?.currentRanking - b.scoring?.currentRanking;
      } else {
        return 0;
      }
    });

    // ESTAMOS COGIENDO SOLO 6 USUARIOS PARA NO SOBRECARGAR LAS PETICIONES DE LECTURA
    const users6 = usersData.slice(0, 6);
    const users = await Promise.all(
      users6.map(async (user) => {
        if (user && user.profilePicture) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `users/${user.id}/profile-picture/${user.profilePicture}`,
          });
          user.profilePicture = profilePictureUrl;
        }
        const readings =
          await this.serviceReadingRepository.getLastsTwoMonthsUserServicesReadings(
            user.id
          );
        const savings: Savings = readings.reduce(
          (savingByConnectionsAcc: any, currentReading: ServiceReadingDTO) => {
            const connectionId = currentReading.serviceConnectionId;
            const last2MonthsReadings = readings
              .filter((reading) => connectionId === reading.serviceConnectionId)
              .filter(
                (reading) =>
                  reading.value !== null && reading.value !== undefined
              )
              .sort(compareAsc)
              .slice(-2);
            const saving = calculateSaving(last2MonthsReadings);
            savingByConnectionsAcc[connectionId] = saving;
            return savingByConnectionsAcc;
          },
          {} as [
            {
              connectionId: string;
              value: number;
              unit: string;
              type: ServiceType;
            }
          ]
        );
        const globalSaving = Object.values(savings).reduce(
          (globalSavingsAcc: number, currentSaving: any) => {
            globalSavingsAcc = globalSavingsAcc + currentSaving.value;
            return globalSavingsAcc;
          },
          0 as number
        );
        const userDataSaving = {
          id: user.id,
          name: user.name,
          surname: user.surname,
          profilePicture: user.profilePicture,
          globalSaving: globalSaving,
          scoring: user.scoring,
        };
        return userDataSaving;
      })
    );

    users.sort((a, b) => {
      if (a.scoring && b.scoring) {
        return a.scoring?.currentRanking - b.scoring?.currentRanking;
      } else {
        return 0;
      }
    });

    const globalSavingCommunity = users.reduce(
      (globalSavingCommunityAcc: number, currentUserSaving: any) => {
        globalSavingCommunityAcc =
          globalSavingCommunityAcc + currentUserSaving.globalSaving;
        return globalSavingCommunityAcc;
      },
      0 as number
    );

    const usersRankingData: UserRankingData[] = (await users)
      .sort((a, b) => {
        if (a.scoring?.currentRanking && b.scoring?.currentRanking) {
          return a.scoring?.currentRanking - b.scoring?.currentRanking;
        } else {
          return 0;
        }
      })
      .slice(0, 10);

    const communityResponse = {
      ...community,
      usersRankingData: usersRankingData,
      globalSavingCommunity: globalSavingCommunity,
    };

    return communityResponse;
  }
}

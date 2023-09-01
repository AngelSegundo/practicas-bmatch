import {
  RankingDTO,
  RANKING_TABLE_NAME,
  ServiceReadingDTO,
  SERVICE_READING_TABLE_NAME,
  UserDTO,
  USER_TABLE_NAME,
} from "domain/entities";
import {
  UserRepository,
  UserRepositoryImpl,
  RankingRepository,
  RankingRepositoryImpl,
  ServiceReadingRepository,
  ServiceReadingRepositoryImpl,
} from "domain/repositories";
import {
  GetUsersUseCaseImpl,
  GetUserRankingUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { StorageService } from "domain/services";

export default class UserController {
  private userRepository: UserRepository;
  private storageService: StorageService;
  private rankingRepository: RankingRepository;
  private serviceReadingRepository: ServiceReadingRepository;

  constructor(database: Database, storageService: StorageService) {
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.rankingRepository = new RankingRepositoryImpl(
      new DataSourceImpl<RankingDTO>(database, RANKING_TABLE_NAME)
    );
    this.serviceReadingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
    this.storageService = storageService;
  }

  public getAll(): Promise<UserDTO[]> {
    const useCase = new GetUsersUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });
    return useCase.execute();
  }
  public getUsersRanking(): Promise<RankingDTO[]> {
    const useCase = new GetUserRankingUseCaseImpl(
      this.userRepository,
      this.rankingRepository,
      this.serviceReadingRepository
    );
    return useCase.execute();
  }
  public getUsersRankingByMonthYear(query: {
    month: string;
    year: string;
  }): Promise<RankingDTO[]> {
    const useCase = new GetUserRankingUseCaseImpl(
      this.userRepository,
      this.rankingRepository,
      this.serviceReadingRepository
    );
    return useCase.execute({ month: query.month, year: query.year });
  }
}

import {
  CommunityDTO,
  COMMUNITY_TABLE_NAME,
  RankingCommunityDTO,
  RANKING_COMMUNITY_TABLE_NAME,
  UserDTO,
  USER_TABLE_NAME,
} from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  RankingCommunityRepository,
  RankingCommunityRepositoryImpl,
  UserRepository,
  UserRepositoryImpl,
} from "domain/repositories";
import {
  CommunityRepository,
  CommunityRepositoryImpl,
} from "domain/repositories/community-repository";
import { StorageService } from "domain/services";
import {
  GetCommunityRankingUseCaseImpl,
  GetCommunitiesUseCaseImpl,
} from "domain/useCases";

export default class CommunityController {
  private communityRepository: CommunityRepository;
  private storageService: StorageService;
  private userRepository: UserRepository;
  private rankingCommunityRepository: RankingCommunityRepository;

  constructor(database: Database, storageService: StorageService) {
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.rankingCommunityRepository = new RankingCommunityRepositoryImpl(
      new DataSourceImpl<RankingCommunityDTO>(
        database,
        RANKING_COMMUNITY_TABLE_NAME
      )
    );
    this.storageService = storageService;
  }

  public async getCommunities(): Promise<CommunityDTO[]> {
    const useCase = new GetCommunitiesUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    return useCase.execute();
  }
  public getCommunitiesRanking(): Promise<RankingCommunityDTO[]> {
    const useCase = new GetCommunityRankingUseCaseImpl(
      this.userRepository,
      this.rankingCommunityRepository,
      this.communityRepository
    );
    return useCase.execute();
  }
}

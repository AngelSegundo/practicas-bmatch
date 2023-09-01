import { Get, Path, Query, Route } from "tsoa";
import { RewardDTO, REWARD_TABLE_NAME } from "domain/entities";
import { RewardRepository, RewardRepositoryImpl } from "domain/repositories";
import {
  GetRewardByIdUseCaseImpl,
  GetRewardsByCountryUseCaseImpl,
  GetRewardsUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { StorageService } from "domain/services";

@Route("rewards")
export default class RewardController {
  private rewardRepository: RewardRepository;
  private storageService: StorageService;

  constructor(database: Database, storageService: StorageService) {
    this.rewardRepository = new RewardRepositoryImpl(
      new DataSourceImpl<RewardDTO>(database, REWARD_TABLE_NAME)
    );
    this.storageService = storageService;
  }
  @Get("/")
  public getRewards(@Query() countryId?: string): Promise<RewardDTO[]> {
    if (countryId) {
      const useCase = new GetRewardsByCountryUseCaseImpl({
        rewardRepository: this.rewardRepository,
        storageService: this.storageService,
      });
      return useCase.execute(countryId);
    } else {
      const useCase = new GetRewardsUseCaseImpl({
        rewardRepository: this.rewardRepository,
        storageService: this.storageService,
      });
      return useCase.execute();
    }
  }
  @Get("{rewardId}")
  public getById(@Path() rewardId: string): Promise<RewardDTO> {
    const useCase = new GetRewardByIdUseCaseImpl({
      rewardRepository: this.rewardRepository,
      storageService: this.storageService,
    });
    return useCase.execute(rewardId);
  }
}

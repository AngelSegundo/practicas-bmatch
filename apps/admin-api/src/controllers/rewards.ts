import { Body, Get, Patch, Path, Post, Put, Query, Route } from "tsoa";
import { Reward, RewardDTO, REWARD_TABLE_NAME } from "domain/entities";
import { RewardRepository, RewardRepositoryImpl } from "domain/repositories";
import {
  GetRewardByIdUseCaseImpl,
  GetRewardsByCountryUseCaseImpl,
  GetRewardsUseCaseImpl,
  CreateRewardUseCaseImpl,
  SetRewardPictureUseCaseImpl,
  UpdateRewardUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { FileData, StorageService } from "domain/services";

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
  @Post("/")
  public createReward(@Body() reward: Reward): Promise<RewardDTO> {
    const useCase = new CreateRewardUseCaseImpl(this.rewardRepository);
    return useCase.execute(reward);
  }
  @Put("/{id}/picture ")
  public updateRewardPicture(
    @Body() picture: FileData,
    @Path() id: string
  ): Promise<RewardDTO> {
    const useCase = new SetRewardPictureUseCaseImpl({
      rewardRepository: this.rewardRepository,
      storageService: this.storageService,
    });
    return useCase.execute({ picture, id });
  }
  @Patch("/{id}")
  public updateReward(
    @Body() reward: Partial<Reward>,
    @Path() id: string
  ): Promise<RewardDTO> {
    const useCase = new UpdateRewardUseCaseImpl({
      rewardRepository: this.rewardRepository,
    });
    return useCase.execute({ reward, id });
  }
}

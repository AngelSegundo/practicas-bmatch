import { RewardDTO } from "../../entities/reward";
import { RewardRepository } from "../../repositories/reward-repository";
import { StorageService } from "../../services";

export interface GetRewardsUseCase {
  execute(): Promise<RewardDTO[]>;
}

export interface GetRewardsUseCaseInput {
  rewardRepository: RewardRepository;
  storageService: StorageService;
}

export class GetRewardsUseCaseImpl implements GetRewardsUseCase {
  private rewardRepository: RewardRepository;
  private storageService: StorageService;

  constructor(props: GetRewardsUseCaseInput) {
    this.rewardRepository = props.rewardRepository;
    this.storageService = props.storageService;
  }
  async execute(): Promise<RewardDTO[]> {
    const rewardData = await this.rewardRepository.getRewards();
    const rewards = await Promise.all(
      rewardData.map(async (reward) => {
        if (reward.picture) {
          const profilePictureUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `rewards/${reward.id}/picture/${reward.picture}`,
          });
          reward.picture = profilePictureUrl;
        }
        return reward;
      })
    );
    return rewards;
  }
}

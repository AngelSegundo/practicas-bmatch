import { RewardDTO } from "../../entities/reward";
import { RewardRepository } from "../../repositories/reward-repository";
import { StorageService } from "../../services";

export interface GetRewardsByCountryUseCase {
  execute(countryId: string): Promise<RewardDTO[]>;
}
export interface GetRewardsByCountryUseCaseInput {
  rewardRepository: RewardRepository;
  storageService: StorageService;
}

export class GetRewardsByCountryUseCaseImpl
  implements GetRewardsByCountryUseCase
{
  rewardRepository: RewardRepository;
  private storageService: StorageService;
  constructor(props: GetRewardsByCountryUseCaseInput) {
    this.rewardRepository = props.rewardRepository;
    this.storageService = props.storageService;
  }

  async execute(countryId: string): Promise<RewardDTO[]> {
    const rewardData = await this.rewardRepository.getRewardsByCountry(
      countryId
    );
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

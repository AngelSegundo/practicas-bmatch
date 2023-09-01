import { RewardDTO } from "../../entities/reward";
import { RewardRepository } from "../../repositories/reward-repository";
import { StorageService } from "../../services";

export interface GetRewardByIdUseCase {
  execute(id: string): Promise<RewardDTO>;
}
export interface GetRewardByIdUseCaseInput {
  rewardRepository: RewardRepository;
  storageService: StorageService;
}

export class GetRewardByIdUseCaseImpl implements GetRewardByIdUseCase {
  private rewardRepository: RewardRepository;
  private storageService: StorageService;

  constructor(props: GetRewardByIdUseCaseInput) {
    this.rewardRepository = props.rewardRepository;
    this.storageService = props.storageService;
  }

  async execute(id: string): Promise<RewardDTO> {
    const reward = await this.rewardRepository.getRewardById(id);
    if (reward && reward.picture) {
      const pictureUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `rewards/${id}/picture/${reward.picture}`,
      });
      reward.picture = pictureUrl;
    }
    return reward;
  }
}

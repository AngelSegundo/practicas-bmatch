import { Reward, RewardDTO } from "../../entities";
import { RewardRepository } from "../../repositories/reward-repository";

export interface CreateRewardUseCase {
  execute(data: Reward): Promise<RewardDTO>;
}

export class CreateRewardUseCaseImpl implements CreateRewardUseCase {
  rewardRepository: RewardRepository;
  constructor(sponsorRepository: RewardRepository) {
    this.rewardRepository = sponsorRepository;
  }

  async execute(data: Reward): Promise<RewardDTO> {
    return this.rewardRepository.createReward(data);
  }
}

import { Reward, RewardDTO } from "../../entities";
import { RewardRepository } from "../../repositories";

export interface UpdateRewardUseCaseInput {
  id: string;
  reward: Partial<Reward>;
}
export interface UpdateRewardUseCase {
  execute(input: UpdateRewardUseCaseInput): Promise<RewardDTO>;
}

export interface UpdateRewardUseCaseProps {
  rewardRepository: RewardRepository;
}

export class UpdateRewardUseCaseImpl implements UpdateRewardUseCase {
  rewardRepository: RewardRepository;
  constructor(props: UpdateRewardUseCaseProps) {
    this.rewardRepository = props.rewardRepository;
  }

  async execute(input: UpdateRewardUseCaseInput): Promise<RewardDTO> {
    const { reward, id } = input;
    return this.rewardRepository.updateReward(reward, id);
  }
}

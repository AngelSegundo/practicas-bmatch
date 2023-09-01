import { GoalDTO } from "../../entities/goal";
import { GoalRepository } from "../../repositories/goal-repository";

export interface GetGoalByIdUseCase {
  execute(id: string): Promise<GoalDTO>;
}
export interface GetGoalByIdUseCaseInput {
  goalRepository: GoalRepository;
}

export class GetGoalByIdUseCaseImpl implements GetGoalByIdUseCase {
  private goalRepository: GoalRepository;

  constructor(props: GetGoalByIdUseCaseInput) {
    this.goalRepository = props.goalRepository;
  }

  async execute(id: string): Promise<GoalDTO> {
    const goal = await this.goalRepository.getGoalById(id);
    return goal;
  }
}

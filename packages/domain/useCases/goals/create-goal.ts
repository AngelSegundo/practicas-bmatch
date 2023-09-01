import { Goal, GoalDTO } from "../../entities";
import { GoalRepository } from "../../repositories/goal-repository";

export interface CreateGoalUseCase {
  execute(data: Goal): Promise<GoalDTO>;
}

export class CreateGoalUseCaseImpl implements CreateGoalUseCase {
  goalRepository: GoalRepository;
  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  async execute(data: Goal): Promise<GoalDTO> {
    return this.goalRepository.createGoal(data);
  }
}

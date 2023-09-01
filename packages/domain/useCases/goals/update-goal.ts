import { Goal, GoalDTO } from "../../entities";
import { GoalRepository } from "../../repositories";

export interface UpdateGoalUseCaseInput {
  id: string;
  goal: Partial<Goal>;
}
export interface UpdateGoalUseCase {
  execute(input: UpdateGoalUseCaseInput): Promise<GoalDTO>;
}

export interface UpdateGoalUseCaseProps {
  goalRepository: GoalRepository;
}

export class UpdateGoalUseCaseImpl implements UpdateGoalUseCase {
  goalRepository: GoalRepository;
  constructor(props: UpdateGoalUseCaseProps) {
    this.goalRepository = props.goalRepository;
  }

  async execute(input: UpdateGoalUseCaseInput): Promise<GoalDTO> {
    const { goal, id } = input;
    return this.goalRepository.updateGoal(goal, id);
  }
}

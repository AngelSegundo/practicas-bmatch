import { GoalDTO } from "../../entities";
import { GoalRepository } from "../../repositories/goal-repository";
export interface GetGoalsUseCaseInput {
  goalRepository: GoalRepository;
}
export interface GetGoalsUseCase {
  execute(): Promise<GoalDTO[]>;
}
export class GetGoalsUseCaseImpl implements GetGoalsUseCase {
  private goalRepository: GoalRepository;
  constructor(props: GetGoalsUseCaseInput) {
    this.goalRepository = props.goalRepository;
  }
  async execute(): Promise<GoalDTO[]> {
    return await this.goalRepository.getGoals();
  }
}

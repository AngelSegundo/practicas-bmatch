import { Get, Route } from "tsoa";
import { GoalDTO, GOAL_TABLE_NAME } from "domain/entities";
import { GetGoalsUseCaseImpl } from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { GoalRepository, GoalRepositoryImpl } from "domain/repositories";

@Route("goals")
export default class GoalController {
  private goalRepository: GoalRepository;

  constructor(database: Database) {
    this.goalRepository = new GoalRepositoryImpl(
      new DataSourceImpl<GoalDTO>(database, GOAL_TABLE_NAME)
    );
  }
  @Get("/")
  public getGoals(): Promise<GoalDTO[]> {
    const useCase = new GetGoalsUseCaseImpl({
      goalRepository: this.goalRepository,
    });
    return useCase.execute();
  }
}

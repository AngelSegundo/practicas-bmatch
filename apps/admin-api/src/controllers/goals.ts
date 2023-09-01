import { Body, Get, Patch, Path, Post, Route } from "tsoa";
import { Goal, GoalDTO, GOAL_TABLE_NAME } from "domain/entities";
import {
  CreateGoalUseCaseImpl,
  GetGoalByIdUseCaseImpl,
  GetGoalsUseCaseImpl,
  UpdateGoalUseCaseImpl,
} from "domain/useCases";
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
  @Get("{id}")
  public getById(@Path() id: string): Promise<GoalDTO> {
    const useCase = new GetGoalByIdUseCaseImpl({
      goalRepository: this.goalRepository,
    });
    return useCase.execute(id);
  }
  @Post("/")
  public createGoal(@Body() goal: Goal): Promise<GoalDTO> {
    const useCase = new CreateGoalUseCaseImpl(this.goalRepository);
    return useCase.execute(goal);
  }
  @Patch("/{id}")
  public updateGoal(
    @Body() goal: Partial<Goal>,
    @Path() id: string
  ): Promise<GoalDTO> {
    const useCase = new UpdateGoalUseCaseImpl({
      goalRepository: this.goalRepository,
    });
    return useCase.execute({ goal, id });
  }
}

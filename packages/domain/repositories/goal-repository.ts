import { Goal, GoalDTO, GOAL_ID_PREFIX } from "../entities";
import { DataSource } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface GoalRepository {
  getGoals(): Promise<GoalDTO[]>;
  getGoalById(id: string): Promise<GoalDTO>;
  createGoal(data: Goal): Promise<GoalDTO>;
  updateGoal(data: Partial<Goal>, id: string): Promise<GoalDTO>;
}
export class GoalRepositoryImpl implements GoalRepository {
  dataSource: DataSource<GoalDTO>;
  constructor(dataSource: DataSource<GoalDTO>) {
    this.dataSource = dataSource;
  }
  getGoals(): Promise<GoalDTO[]> {
    return this.dataSource.getAll();
  }
  getGoalById(id: string): Promise<GoalDTO> {
    return this.dataSource.getById(id);
  }
  async createGoal(data: Goal): Promise<GoalDTO> {
    const datetime = new Date().toISOString();
    const goal = {
      ...data,
      id: generateKsuid(GOAL_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as GoalDTO;
    return this.dataSource.create(goal);
  }
  async updateGoal(data: Partial<Goal>, id: string): Promise<GoalDTO> {
    const datetime = new Date().toISOString();
    const goal = data as Partial<GoalDTO>;
    goal.updatedAt = datetime;
    return this.dataSource.update(id, goal);
  }
}

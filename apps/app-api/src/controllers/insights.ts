import { Get, Route } from "tsoa";
import { InsightDTO, INSIGHTS_TABLE_NAME } from "domain/entities";
import { GetInsightsUseCaseImpl  } from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  InsightRepository,
  InsightRepositoryImpl,
} from "domain/repositories";

@Route("insights")
export default class InsightController {
  private insightRepository: InsightRepository;

  constructor(database: Database) {
    this.insightRepository = new InsightRepositoryImpl(
      new DataSourceImpl<InsightDTO>(database, INSIGHTS_TABLE_NAME)
    );
  }
  @Get("/")
  public getInsights(): Promise<InsightDTO[]> {
    const useCase = new GetInsightsUseCaseImpl({
      insightRepository: this.insightRepository,
    });
    return useCase.execute();
  }
}

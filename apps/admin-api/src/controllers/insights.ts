import { Body, Get, Patch, Path, Post, Route } from "tsoa";
import { Insight, InsightDTO, INSIGHTS_TABLE_NAME } from "domain/entities";
import {
  CreateInsightUseCaseImpl,
  GetInsightByIdUseCaseImpl,
  GetInsightsUseCaseImpl,
  UpdateInsightUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { InsightRepository, InsightRepositoryImpl } from "domain/repositories";

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
  @Get("{id}")
  public getById(@Path() id: string): Promise<InsightDTO> {
    const useCase = new GetInsightByIdUseCaseImpl({
      insightRepository: this.insightRepository,
    });
    return useCase.execute(id);
  }
  @Post("/")
  public createInsight(@Body() insight: Insight): Promise<InsightDTO> {
    const useCase = new CreateInsightUseCaseImpl(this.insightRepository);
    return useCase.execute(insight);
  }
  @Patch("/{id}")
  public updateInsight(
    data: Partial<Insight>,
    @Path() id: string
  ): Promise<InsightDTO> {
    const useCase = new UpdateInsightUseCaseImpl(this.insightRepository);
    return useCase.execute({ data, id });
  }
}

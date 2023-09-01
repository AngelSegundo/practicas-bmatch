import { InsightDTO } from "../../entities/insight";
import { InsightRepository } from "../../repositories/insight-repository";

export interface GetInsightsUseCase {
  execute(): Promise<InsightDTO[]>;
}

export interface GetInsightsUseCaseInput {
  insightRepository: InsightRepository;
}

export class GetInsightsUseCaseImpl implements GetInsightsUseCase {
  private insightRepository: InsightRepository;

  constructor(props: GetInsightsUseCaseInput) {
    this.insightRepository = props.insightRepository;
  }
  async execute(): Promise<InsightDTO[]> {
    const insightData = await this.insightRepository.getInsights();
    const insights = await Promise.all(
      insightData.map(async (insight) => {
        //Start: Obtener array de string de los valores de INSIGHTS//
        const insightTipsValue = insight.insight.map(
          (insight) => insight.value
        );
        insight.insightsValue = insightTipsValue;
        //End: Obtener array de string de los valores de INSIGHTS//
        return insight;
      })
    );
    return insights;
  }
}

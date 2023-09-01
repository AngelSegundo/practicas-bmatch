import { InsightDTO } from "../../entities/insight";
import { InsightRepository } from "../../repositories/insight-repository";

export interface GetInsightByIdUseCase {
  execute(id: string): Promise<InsightDTO>;
}
export interface GetInsightByIdUseCaseInput {
  insightRepository: InsightRepository;
}

export class GetInsightByIdUseCaseImpl implements GetInsightByIdUseCase {
  insightRepository: InsightRepository;

  constructor(props: GetInsightByIdUseCaseInput) {
    this.insightRepository = props.insightRepository;
  }

  async execute(id: string): Promise<InsightDTO> {
    const insight = await this.insightRepository.getInsightById(id);

    //Start: Obtener array de string de los valores de TIPS//
    const insightTipsValue = insight.insight.map((insight) => insight.value);
    insight.insightsValue = insightTipsValue;
    //End: Obtener array de string de los valores de TIPS//

    return insight;
  }
}

import { Insight, InsightDTO } from "../../entities";
import { InsightRepository } from "../../repositories/insight-repository";

export interface CreateInsightUseCase {
  execute(data: Insight): Promise<InsightDTO>;
}

export class CreateInsightUseCaseImpl implements CreateInsightUseCase {
  insightRepository: InsightRepository;
  constructor(insightRepository: InsightRepository) {
    this.insightRepository = insightRepository;
  }

  async execute(data: Insight): Promise<InsightDTO> {
    return this.insightRepository.createInsight(data);
  }
}

import { Insight, InsightDTO } from "../../entities";
import { InsightRepository } from "../../repositories/insight-repository";

export interface UpdateInsightUseCase {
  execute({
    id,
    data,
  }: {
    id: string;
    data: Partial<Insight>;
  }): Promise<InsightDTO>;
}

export class UpdateInsightUseCaseImpl implements UpdateInsightUseCase {
  insightRepository: InsightRepository;
  constructor(insightRepository: InsightRepository) {
    this.insightRepository = insightRepository;
  }

  async execute({
    id,
    data,
  }: {
    id: string;
    data: Partial<Insight>;
  }): Promise<InsightDTO> {
    return this.insightRepository.updateInsight(data, id);
  }
}

import { Ranking, RankingDTO } from "../../entities";
import { RankingRepository } from "../../repositories/ranking-repository";

export interface CreateRankingUseCase {
  execute(data: Ranking): Promise<RankingDTO>;
}

export class CreateRankingUseCaseImpl implements CreateRankingUseCase {
  rankingRepository: RankingRepository;
  constructor(rankingRepository: RankingRepository) {
    this.rankingRepository = rankingRepository;
  }

  async execute(data: Ranking): Promise<RankingDTO> {
    return this.rankingRepository.createRanking(data);
  }
}

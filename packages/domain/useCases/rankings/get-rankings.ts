import { RankingDTO } from "../../entities";
import { RankingRepository } from "../../repositories/ranking-repository";

export interface GetRankingsUseCase {
  execute(): Promise<RankingDTO[]>;
}

export interface GetRankingsUseCaseInput {
  rankingRepository: RankingRepository;
}

export class GetRankingsUseCaseImpl implements GetRankingsUseCase {
  private rankingRepository: RankingRepository;

  constructor(props: GetRankingsUseCaseInput) {
    this.rankingRepository = props.rankingRepository;
  }

  async execute(): Promise<RankingDTO[]> {
    const rankings = await this.rankingRepository.getRankings();

    return rankings;
  }
}

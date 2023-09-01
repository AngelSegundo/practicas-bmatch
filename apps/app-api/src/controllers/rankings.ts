import { Get, Route } from "tsoa";
import { RankingDTO, RANKING_TABLE_NAME } from "domain/entities";
import { GetRankingsUseCaseImpl } from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { RankingRepository, RankingRepositoryImpl } from "domain/repositories";

@Route("rankings")
export default class RankingController {
  private rankingRepository: RankingRepository;

  constructor(database: Database) {
    this.rankingRepository = new RankingRepositoryImpl(
      new DataSourceImpl<RankingDTO>(database, RANKING_TABLE_NAME)
    );
  }
  @Get("/")
  public getRankings(): Promise<RankingDTO[]> {
    const useCase = new GetRankingsUseCaseImpl({
      rankingRepository: this.rankingRepository,
    });
    return useCase.execute();
  }
}

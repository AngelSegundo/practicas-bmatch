import { Ranking, RankingDTO, RANKING_ID_PREFIX } from "../entities";
import { DataSource } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface RankingRepository {
  getRankings(): Promise<RankingDTO[]>;
  getRankingsByUserId(userId: string): Promise<RankingDTO[]>;
  createRanking(data: Ranking): Promise<RankingDTO>;
  updateRanking(data: Partial<Ranking>, id: string): Promise<RankingDTO>;
}
export class RankingRepositoryImpl implements RankingRepository {
  dataSource: DataSource<RankingDTO>;
  constructor(dataSource: DataSource<RankingDTO>) {
    this.dataSource = dataSource;
  }

  getRankings(): Promise<RankingDTO[]> {
    return this.dataSource.getAll();
  }

  getRankingById(id: string): Promise<RankingDTO> {
    return this.dataSource.getById(id);
  }
  async getRankingsByUserId(userId: string): Promise<RankingDTO[]> {
    const rankings = this.dataSource.getAll();
    const rankingsFiltered = (await rankings).filter(
      (ranking) => ranking.userId === userId
    );
    return rankingsFiltered;
  }

  async createRanking(data: Ranking): Promise<RankingDTO> {
    const currentDate = new Date();
    const datetime = currentDate.toISOString();

    const ranking = {
      ...data,
      id: generateKsuid(RANKING_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as RankingDTO;
    return this.dataSource.create(ranking);
  }

  async updateRanking(data: Partial<Ranking>, id: string): Promise<RankingDTO> {
    const datetime = new Date().toISOString();
    const ranking = data as Partial<RankingDTO>;
    ranking.updatedAt = datetime;
    return this.dataSource.update(id, ranking);
  }

  // delete ranking
  async deleteRanking(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}

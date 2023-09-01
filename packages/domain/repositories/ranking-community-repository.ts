import {
  RankingCommunity,
  RankingCommunityDTO,
  RANKING_COMMUNITY_ID_PREFIX,
} from "../entities";
import { DataSource } from "../interfaces";

export interface RankingCommunityRepository {
  getCommunityRankings(): Promise<RankingCommunityDTO[]>;
  getCommunityRankingsByCommunityId(
    CommunityId: string
  ): Promise<RankingCommunityDTO[]>;
  createCommunityRanking(data: RankingCommunity): Promise<RankingCommunityDTO>;
  updateCommunityRanking(
    data: Partial<RankingCommunity>,
    id: string
  ): Promise<RankingCommunityDTO>;
}
export class RankingCommunityRepositoryImpl
  implements RankingCommunityRepository
{
  dataSource: DataSource<RankingCommunityDTO>;
  constructor(dataSource: DataSource<RankingCommunityDTO>) {
    this.dataSource = dataSource;
  }

  getCommunityRankings(): Promise<RankingCommunityDTO[]> {
    return this.dataSource.getAll();
  }
  async getCommunityRankingsByCommunityId(
    communityId: string
  ): Promise<RankingCommunityDTO[]> {
    const rankings = this.dataSource.getAll();
    const rankingsFiltered = (await rankings).filter(
      (ranking) => ranking.communityId === communityId
    );
    return rankingsFiltered;
  }

  async createCommunityRanking(
    data: RankingCommunity
  ): Promise<RankingCommunityDTO> {
    const currentDate = new Date();
    const datetime = currentDate.toISOString();
    const currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = new Date().getFullYear();

    const ranking = {
      ...data,
      id: `${RANKING_COMMUNITY_ID_PREFIX}_${data.communityId}_${currentMonth}_${year}`,
      createdAt: datetime,
      updatedAt: datetime,
    } as RankingCommunityDTO;
    return this.dataSource.create(ranking);
  }

  async updateCommunityRanking(
    data: Partial<RankingCommunity>,
    id: string
  ): Promise<RankingCommunityDTO> {
    const datetime = new Date().toISOString();
    const ranking = data as Partial<RankingCommunityDTO>;
    ranking.updatedAt = datetime;
    return this.dataSource.update(id, ranking);
  }

  // delete ranking
  async deleteRanking(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}

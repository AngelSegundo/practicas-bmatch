import { DataSource, QuerySearchTypes } from "../interfaces";
import { Reward, RewardDTO, REWARD_ID_PREFIX } from "../entities/reward";
import { generateKsuid } from "../utilities/ids";

export interface RewardRepository {
  getRewards(): Promise<RewardDTO[]>;
  getRewardById(id: string): Promise<RewardDTO>;
  getRewardsByCountry(countryId: string): Promise<RewardDTO[]>;
  getRewardsByCountry(countryId: string): Promise<RewardDTO[]>;
  createReward(data: Reward): Promise<RewardDTO>;
  updateReward(data: Partial<Reward>, id: string): Promise<RewardDTO>;
}
export class RewardRepositoryImpl implements RewardRepository {
  dataSource: DataSource<RewardDTO>;
  constructor(dataSource: DataSource<RewardDTO>) {
    this.dataSource = dataSource;
  }
  getRewards(): Promise<RewardDTO[]> {
    return this.dataSource.getAll();
  }
  getRewardById(id: string): Promise<RewardDTO> {
    return this.dataSource.getById(id);
  }
  getRewardsByCountry(countryId: string): Promise<RewardDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "countryId",
        searchType: QuerySearchTypes.EQUALS,
        value: countryId,
      },
    ]);
  }
  async createReward(data: Reward): Promise<RewardDTO> {
    const datetime = new Date().toISOString();
    const reward = {
      ...data,
      id: generateKsuid(REWARD_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as RewardDTO;
    return this.dataSource.create(reward);
  }
  async updateReward(data: Partial<Reward>, id: string): Promise<RewardDTO> {
    const datetime = new Date().toISOString();
    const reward = data as Partial<RewardDTO>;
    reward.updatedAt = datetime;
    return this.dataSource.update(id, reward);
  }
}

import { Community, CommunityDTO, COMMUNITY_ID_PREFIX } from "../entities";
import { DataSource, QuerySearchTypes } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface CommunityRepository {
  getCommunities(): Promise<CommunityDTO[]>;
  getCommunityById(id: string): Promise<CommunityDTO>;
  getCommunitiesBySponsorId(sponsorId: string): Promise<CommunityDTO[]>;
  getPublicCommunities(): Promise<CommunityDTO[]>;
  getCommunityIdByAccessCode(
    accessCode: string
  ): Promise<{ communityId: string } | undefined>;
  createCommunity(data: Community): Promise<CommunityDTO>;
  updateCommunity(data: Partial<Community>, id: string): Promise<CommunityDTO>;
  deleteCommunity(id: string): Promise<void>;
}

export class CommunityRepositoryImpl implements CommunityRepository {
  dataSource: DataSource<CommunityDTO>;
  constructor(dataSource: DataSource<CommunityDTO>) {
    this.dataSource = dataSource;
  }

  getCommunities(): Promise<CommunityDTO[]> {
    return this.dataSource.getAll();
  }
  async getCommunityById(id: string): Promise<CommunityDTO> {
    const community = this.dataSource.getById(id);
    return community;
  }
  getCommunitiesBySponsorId(sponsorId: string): Promise<CommunityDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "sponsorId",
        searchType: QuerySearchTypes.EQUALS,
        value: sponsorId,
      },
    ]);
  }
  getPublicCommunities(): Promise<CommunityDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "isPublic",
        searchType: QuerySearchTypes.EQUALS,
        value: true,
      },
    ]);
  }
  async getCommunityIdByAccessCode(
    accessCode: string
  ): Promise<{ communityId: string } | undefined> {
    const communities = await this.dataSource.find([
      {
        fieldName: "accessCode",
        searchType: QuerySearchTypes.EQUALS,
        value: accessCode,
      },
    ]);
    if ((await communities.length) > 0)
      return { communityId: communities[0].id };
  }
  async createCommunity(data: Community): Promise<CommunityDTO> {
    const datetime = new Date().toISOString();
    const community = {
      ...data,
      id: generateKsuid(COMMUNITY_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as CommunityDTO;
    return this.dataSource.create(community);
  }

  async updateCommunity(
    data: Partial<Community>,
    id: string
  ): Promise<CommunityDTO> {
    const datetime = new Date().toISOString();
    const community = data as Partial<CommunityDTO>;
    community.updatedAt = datetime;
    return this.dataSource.update(id, community);
  }

  async deleteCommunity(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}

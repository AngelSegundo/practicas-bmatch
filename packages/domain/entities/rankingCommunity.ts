import { BaseEntity } from "./base";

export const RANKING_COMMUNITY_TABLE_NAME = "rankingsCommunity";
export const RANKING_COMMUNITY_ID_PREFIX = "savC";

export interface RankingCommunity {
  communityId: string;
  month: string;
  year: string;
  savings: number;
  rankingCommunity: number;
  previous_ranking_community: number;
}

export interface RankingCommunityDTO extends BaseEntity, RankingCommunity {}

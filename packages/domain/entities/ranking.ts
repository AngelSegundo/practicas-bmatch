import { BaseEntity } from "./base";

export const RANKING_TABLE_NAME = "rankings";

export const RANKING_ID_PREFIX = "rank";

export interface Ranking {
  userId: string;
  month: string;
  year: string;
  savings: number;
  savings_gas: number;
  savings_electricity: number;
  savings_water: number;
  savings_freeway: number;
  ranking: number;
  previous_ranking: number;
}

export interface RankingDTO extends BaseEntity, Ranking {}

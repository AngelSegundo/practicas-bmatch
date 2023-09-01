import { BaseEntity } from "./base";

export const INSIGHTS_TABLE_NAME = "insights";
export const INSIGHTS_ID_PREFIX = "ins";

export enum InsightLevel {
  galactic = "Bgalactico",
  expert = "Bexperto",
  novice = "Bnovato",
}

export interface InsightInput {
  value: string;
}
export interface Insight {
  level: InsightLevel;
  insight: InsightInput[];
  insightsValue?: string[];
}

export interface InsightDTO extends BaseEntity, Insight {}

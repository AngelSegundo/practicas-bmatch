import { BaseEntity } from "./base";
import { ServiceType } from "./service";

export const GOAL_TABLE_NAME = "goals";
export const GOAL_ID_PREFIX = "goal";

export interface Goal {
  type: ServiceType;
  value: number;
}

export interface GoalDTO extends BaseEntity, Goal {}

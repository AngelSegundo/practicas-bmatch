import { BaseEntity } from "./base";
export const REWARD_TABLE_NAME = "rewards";
export const REWARD_ID_PREFIX = "rew";

export enum RewardType {
  food = "food",
  ticket = "ticket",
  selfCare = "selfCare",
  shopping = "shopping",
  market = "market",
  travel = "travel",
}
export interface ProviderReward {
  name: string;
  providerPicture: string;
}
export const enum WeekDay {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}
export interface Schedule {
  timeFrom: string;
  timeTo: string;
  weekDays?: WeekDay[];
}
export interface Reward {
  title: string;
  subtitle?: string;
  description?: string;
  type: RewardType;
  discount?: number;
  picture?: string;
  expirationDate?: string;
  schedule?: Schedule;
  provider?: ProviderReward;
  countryId?: string;
  isActive: boolean;
  code: string;
}
export interface ClaimedReward extends Reward {
  rewardId: string;
  userId: string;
}

export interface RewardDTO extends BaseEntity, Reward {}

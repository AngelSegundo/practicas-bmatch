import zod from "zod";
import { BaseEntity, BaseEntitySchema } from "./base";
export const COMMUNITY_TABLE_NAME = "communities";
export const COMMUNITY_ID_PREFIX = "com";

export interface Community {
  name: string;
  description: string;
  countryId: string;
  sponsorId?: string;
  sponsorName?: string;
  isSponsorDefault?: boolean;
  profilePicture?: string;
  isCorporate: boolean;
  founderId?: string;
  isPublic: boolean;
  isVisible: boolean;
  headCount?: number;
  accessCode?: string;
  status: "active" | "inactive";
  scoring?: {
    currentRanking: number;
    previousRanking: number;
    currentRankingId: string;
    savings: number;
  };
}

export const CommunitySchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  countryId: zod.string(),
  sponsorId: zod.string().optional(),
  sponsorName: zod.string().optional(),
  isSponsorDefault: zod.boolean().optional(),
  profilePicture: zod.string().optional(),
  isCorporate: zod.boolean(),
  founderId: zod.string().optional(),
  isPublic: zod.boolean(),
  headCount: zod.number().optional(),
  accessCode: zod.string().optional(),
  status: zod.union([zod.literal("active"), zod.literal("inactive")]),
});

export const CommunityDTOSchema = CommunitySchema.merge(BaseEntitySchema);

export interface UserRankingData {
  id: string;
  name: string;
  surname: string;
  profilePicture: string | undefined;
  globalSaving: number;
}
export interface CommunityDetailed extends CommunityDTO {
  usersRankingData: (UserRankingData | undefined)[];
  globalSavingCommunity: number;
}

export interface CommunityDTO extends BaseEntity, Community {}

import { createApi } from "@reduxjs/toolkit/query/react";
import { Reward, RewardDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const rewardApi = createApi({
  reducerPath: "reward",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Reward", "Rewards"],
  endpoints: (build) => ({
    getRewardById: build.query<RewardDTO, string>({
      query: (id) => ({
        url: `/rewards/${id}`,
        method: "GET",
      }),
      providesTags: ["Reward"],
    }),
    getAllRewards: build.query<RewardDTO[], unknown>({
      query: () => ({
        url: `/rewards`,
        method: "GET",
      }),
      providesTags: ["Rewards"],
    }),
    rewardSave: build.mutation<RewardDTO, Reward>({
      query: (data) => ({
        url: `/rewards`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reward", "Rewards"],
    }),

    updatePicture: build.mutation<RewardDTO, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/rewards/${id}/picture`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reward", "Rewards"],
    }),
    updateReward: build.mutation<
      RewardDTO,
      {
        id: string;
        data: Reward;
      }
    >({
      query: ({ id, data }) => ({
        url: `/rewards/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Reward", "Rewards"],
    }),
  }),
});

export const {
  useGetAllRewardsQuery,
  useGetRewardByIdQuery,
  useUpdateRewardMutation,
  useUpdatePictureMutation,
  useRewardSaveMutation,
} = rewardApi;

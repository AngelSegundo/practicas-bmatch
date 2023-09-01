import { createApi } from "@reduxjs/toolkit/query/react";
import { Community, CommunityDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const communityApi = createApi({
  reducerPath: "community",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Community", "Communities"],
  endpoints: (build) => ({
    getCommunityById: build.query<CommunityDTO, string>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: "GET",
      }),
      providesTags: ["Community"],
    }),
    getCommunitiesBySponsorId: build.query<CommunityDTO[], string | undefined>({
      query: (sponsorId) => ({
        url: `/communities`,
        method: "GET",
        params: { sponsorId },
      }),
      providesTags: ["Communities"],
    }),
    getCommunitiesOfSponsorAndPublics: build.query<
      CommunityDTO[],
      string | undefined
    >({
      query: (sponsorId) => ({
        url: `/communities`,
        method: "GET",
        params: { sponsorId, withPublics: true },
      }),
      providesTags: ["Communities"],
    }),
    getAllCommunities: build.query<CommunityDTO[], unknown>({
      query: () => ({
        url: `/communities`,
        method: "GET",
      }),
      providesTags: ["Communities"],
    }),
    communitySave: build.mutation<CommunityDTO, Community>({
      query: (data) => ({
        url: `/communities`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Community", "Communities"],
    }),
    updateLogo: build.mutation<CommunityDTO, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/communities/${id}/logo`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Community", "Communities"],
    }),
    updateCommunity: build.mutation<
      CommunityDTO,
      {
        id: string;
        data: Community;
      }
    >({
      query: ({ id, data }) => ({
        url: `/communities/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Community", "Communities"],
    }),
    deleteCommunityById: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community", "Communities"],
    }),
  }),
});

export const {
  useGetCommunityByIdQuery,
  useGetCommunitiesBySponsorIdQuery,
  useLazyGetCommunitiesBySponsorIdQuery,
  useGetAllCommunitiesQuery,
  useLazyGetCommunityByIdQuery,
  useLazyGetCommunitiesOfSponsorAndPublicsQuery,
  useCommunitySaveMutation,
  useUpdateLogoMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityByIdMutation,
} = communityApi;

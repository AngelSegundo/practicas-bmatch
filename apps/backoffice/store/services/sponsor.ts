import { createApi } from "@reduxjs/toolkit/query/react";
import { Sponsor, SponsorDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const sponsorApi = createApi({
  reducerPath: "sponsor",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Sponsor", "Sponsors"],
  endpoints: (build) => ({
    getAllSponsors: build.query<SponsorDTO[], void>({
      query: () => ({
        url: "/sponsors",
        method: "GET",
      }),
      providesTags: ["Sponsors"],
    }),
    getSponsorById: build.query<SponsorDTO, string>({
      query: (id) => ({
        url: `/sponsors/${id}`,
        method: "GET",
      }),
      providesTags: ["Sponsor"],
    }),
    sponsorSave: build.mutation<SponsorDTO, Sponsor>({
      query: (data) => ({
        url: `/sponsors`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sponsor", "Sponsors"],
    }),
    updateSponsor: build.mutation<
      SponsorDTO,
      {
        id: string;
        data: Sponsor;
      }
    >({
      query: ({ id, data }) => ({
        url: `/sponsors/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sponsor", "Sponsors"],
    }),
  }),
});

export const {
  useLazyGetAllSponsorsQuery,
  useGetAllSponsorsQuery,
  useGetSponsorByIdQuery,
  useLazyGetSponsorByIdQuery,
  useSponsorSaveMutation,
  useUpdateSponsorMutation,
} = sponsorApi;

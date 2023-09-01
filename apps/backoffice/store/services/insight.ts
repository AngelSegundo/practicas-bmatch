import { createApi } from "@reduxjs/toolkit/query/react";
import { Insight, InsightDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const insightApi = createApi({
  reducerPath: "insights",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Insight", "Insights"],
  endpoints: (build) => ({
    getInsightById: build.query<InsightDTO, string | undefined>({
      query: (id) => ({
        url: `/insights/${id}`,
        method: "GET",
      }),
      providesTags: ["Insight"],
    }),
    getAllInsights: build.query<InsightDTO[], void>({
      query: () => ({
        url: `/insights`,
        method: "GET",
      }),
      providesTags: ["Insights"],
    }),
    insightSave: build.mutation<InsightDTO, Insight>({
      query: (data) => ({
        url: `/insights`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Insight", "Insights"],
    }),
    insightUpdate: build.mutation<InsightDTO, { id: string; data: Insight }>({
      query: ({ id, data }) => ({
        url: `/insights/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Insight", "Insights"],
    }),
  }),
});

export const {
  useGetAllInsightsQuery,
  useGetInsightByIdQuery,
  useInsightUpdateMutation,
  useInsightSaveMutation,
} = insightApi;

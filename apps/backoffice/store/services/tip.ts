import { createApi } from "@reduxjs/toolkit/query/react";
import { Tip, TipDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const tipApi = createApi({
  reducerPath: "tip",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Tip", "Tips"],
  endpoints: (build) => ({
    getTipById: build.query<TipDTO, string>({
      query: (id) => ({
        url: `/tips/${id}`,
        method: "GET",
      }),
      providesTags: ["Tip"],
    }),
    getAllTips: build.query<TipDTO[], void>({
      query: () => ({
        url: `/tips`,
        method: "GET",
      }),
      providesTags: ["Tips"],
    }),
    tipSave: build.mutation<TipDTO, Tip>({
      query: (data) => ({
        url: `/tips`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tip", "Tips"],
    }),

    updateTip: build.mutation<
      TipDTO,
      {
        id: string;
        data: Tip;
      }
    >({
      query: ({ id, data }) => ({
        url: `/tips/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tip", "Tips"],
    }),
    deleteTip: build.mutation<void, string>({
      query: (id) => ({
        url: `/tips/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tip", "Tips"],
    }),
    updateImage: build.mutation<TipDTO, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/tips/${id}/image`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tip", "Tips"],
    }),
    deleteTipImage: build.mutation<
      TipDTO,
      { id: string, image: string }
    >({
      query: ({ id, image }) => ({
        url: `/tips/${id}/image/${image}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tip", "Tips"],
    }),
  }),
});

export const {
  useGetAllTipsQuery,
  useGetTipByIdQuery,
  useUpdateTipMutation,
  useTipSaveMutation,
  useDeleteTipMutation,
  useUpdateImageMutation,
  useDeleteTipImageMutation,
} = tipApi;

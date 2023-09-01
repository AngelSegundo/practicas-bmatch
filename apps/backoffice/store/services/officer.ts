import { createApi } from "@reduxjs/toolkit/query/react";
import { OfficerDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

// todo: move to shared library

export const officerApi = createApi({
  reducerPath: "officer",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Officer", "Officers"],
  endpoints: (build) => ({
    getOfficerById: build.query<OfficerDTO, string>({
      query: (id) => `/officers/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Officer", id: result.id }] : ["Officer"],
    }),
  }),
});

export const {
  useGetOfficerByIdQuery,
  useLazyGetOfficerByIdQuery,
  util: { getRunningOperationPromises, resetApiState },
} = officerApi;

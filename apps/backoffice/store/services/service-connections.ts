import { createApi } from "@reduxjs/toolkit/query/react";
import { ServiceConnectionDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const serviceConnectionsApi = createApi({
  reducerPath: "service-connections",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["ServiceConnections", "ServiceReadings", "ServiceConnection"],
  endpoints: (build) => ({
    getServiceConnections: build.query<ServiceConnectionDTO[], void>({
      query: () => ({
        url: `/service-connections`,
        method: "GET",
      }),
      providesTags: ["ServiceConnections"],
    }),
    getServiceConnectionsByUserId: build.query<ServiceConnectionDTO[], string>({
      query: (userId) => ({
        url: `/service-connections`,
        method: "GET",
        params: { userId },
      }),
      providesTags: ["ServiceConnections"],
    }),
    deleteServiceConnection: build.mutation<void, string>({
      query: (id) => ({
        url: `/service-connections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceConnections"],
    }),
  }),
});

export const {
  useLazyGetServiceConnectionsByUserIdQuery,
  useGetServiceConnectionsQuery,
  useDeleteServiceConnectionMutation,
} = serviceConnectionsApi;

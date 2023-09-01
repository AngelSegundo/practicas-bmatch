import { createApi } from "@reduxjs/toolkit/query/react";
import { ServiceReading, ServiceReadingDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const serviceReadingsApi = createApi({
  reducerPath: "service-readings",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["ServiceReading"],
  endpoints: (build) => ({
    getServiceReadingsByConnectionId: build.query<ServiceReadingDTO[], string>({
      query: (connectionId) => ({
        url: `/service-readings`,
        method: "GET",
        params: { connectionId },
      }),
      providesTags: ["ServiceReading"],
    }),

    getServiceReadingPDF: build.query<
      { data: string | null },
      { serviceReadingId: string; serviceKey: string }
    >({
      query: ({ serviceReadingId, serviceKey }) => ({
        url: `/service-readings/pdf`,
        method: "GET",
        params: { serviceReadingId, serviceKey },
      }),
    }),

    addServiceReading: build.mutation<
      ServiceReadingDTO,
      { connectionId: string; data: ServiceReading }
    >({
      query: ({ data: data }) => ({
        url: `/service-readings`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ServiceReading"],
    }),

    changeServiceReadingValue: build.mutation<
      ServiceReadingDTO,
      {
        id: string;
        value: number;
      }
    >({
      query: ({ id, value }) => ({
        url: `/service-readings/${id}`,
        method: "PATCH",
        body: { value },
      }),
    }),
  }),
});

export const {
  useAddServiceReadingMutation,
  useGetServiceReadingsByConnectionIdQuery,
  useLazyGetServiceReadingsByConnectionIdQuery,
  useChangeServiceReadingValueMutation,
  useGetServiceReadingPDFQuery,
  useLazyGetServiceReadingPDFQuery,
} = serviceReadingsApi;

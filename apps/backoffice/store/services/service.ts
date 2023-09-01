import { createApi } from "@reduxjs/toolkit/query/react";
import { Service, ServiceDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const servicesApi = createApi({
  reducerPath: "services",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Service", "Services"],
  endpoints: (build) => ({
    getAllServices: build.query<ServiceDTO[], void>({
      query: () => ({
        url: `/services`,
        method: "GET",
      }),
      providesTags: ["Services"],
    }),
    getServiceByCountry: build.query<ServiceDTO[], string | undefined>({
      query: (countryId) => ({
        url: `/services`,
        method: "GET",
        params: { countryId },
      }),
    }),
    getServiceById: build.query<ServiceDTO, string | undefined>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    serviceSave: build.mutation<ServiceDTO, Service>({
      query: (data) => ({
        url: `/services`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service", "Services"],
    }),
    serviceUpdate: build.mutation<
      ServiceDTO,
      { id: string; data: Partial<Service> }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Service", "Services"],
    }),
    updateLogo: build.mutation<ServiceDTO, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/services/${id}/logo`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Service", "Services"],
    }),
    uploadServiceImageHelperFile: build.mutation<
      ServiceDTO,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `services/${id}/uploadImageHelper`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service", "Services"],
    }),
    deleteServiceHelperImage: build.mutation<
      ServiceDTO,
      { id: string; index: number }
    >({
      query: ({ id, index }) => ({
        url: `services/${id}/uploadImageHelper/${index}}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service", "Services"],
    }),
  }),
});

export const {
  useGetServiceByCountryQuery,
  useLazyGetServiceByIdQuery,
  useGetServiceByIdQuery,
  useDeleteServiceHelperImageMutation,
  useGetAllServicesQuery,
  useServiceSaveMutation,
  useServiceUpdateMutation,
  useUpdateLogoMutation,
  useUploadServiceImageHelperFileMutation,
} = servicesApi;

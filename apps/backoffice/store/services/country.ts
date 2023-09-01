import { createApi } from "@reduxjs/toolkit/query/react";
import { CountryDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const countryApi = createApi({
  reducerPath: "country",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Country", "Countries"],
  endpoints: (build) => ({
    getCountryById: build.query<CountryDTO, string>({
      query: (id) => ({
        url: `/countries/${id}`,
        method: "GET",
      }),
    }),
    getCountries: build.query<CountryDTO[], void>({
      query: () => ({
        url: `/countries`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCountryByIdQuery,
  useGetCountriesQuery,
  useLazyGetCountryByIdQuery,
} = countryApi;

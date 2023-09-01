import { createApi } from "@reduxjs/toolkit/query/react";
import { Goal, GoalDTO } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

export const goalApi = createApi({
  reducerPath: "goal",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Goal", "Goals"],
  endpoints: (build) => ({
    getGoalById: build.query<GoalDTO, string>({
      query: (id) => ({
        url: `/goals/${id}`,
        method: "GET",
      }),
      providesTags: ["Goal"],
    }),
    getAllGoals: build.query<GoalDTO[], void>({
      query: () => ({
        url: `/goals`,
        method: "GET",
      }),
      providesTags: ["Goals"],
    }),
    goalSave: build.mutation<GoalDTO, Goal>({
      query: (data) => ({
        url: `/goals`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goal", "Goals"],
    }),
    updateGoal: build.mutation<
      GoalDTO,
      {
        id: string;
        data: Goal;
      }
    >({
      query: ({ id, data }) => ({
        url: `/goals/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goal", "Goals"],
    }),
  }),
});

export const {
  useGetAllGoalsQuery,
  useGetGoalByIdQuery,
  useUpdateGoalMutation,
  useGoalSaveMutation,
} = goalApi;

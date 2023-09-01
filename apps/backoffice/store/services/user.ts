import { createApi } from "@reduxjs/toolkit/query/react";
import { Invitation, InvitationDTO, UserDTO, User } from "domain/entities";
import { HYDRATE } from "next-redux-wrapper";
import { baseQuery } from "./core";

// todo: move to shared library

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: baseQuery,
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["User", "Users", "Invitations", "Invitation"],
  endpoints: (build) => ({
    getUserById: build.query<
      UserDTO,
      { id: string; includeCommunities: boolean }
    >({
      query: ({ id, includeCommunities }) =>
        `/users/${id}?includeCommunities=${includeCommunities}`,
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
    }),
    getAllUsers: build.query<UserDTO[], unknown>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUsersBySponsorId: build.query<UserDTO[], string | undefined>({
      query: (sponsorId) => ({
        url: "/users",
        method: "GET",
        params: { sponsorId },
      }),
      providesTags: ["Users"],
    }),
    getUsersByCommunityId: build.query<UserDTO[], string | undefined>({
      query: (communityId) => ({
        url: "/users",
        method: "GET",
        params: { communityId },
      }),
      providesTags: ["Users"],
    }),
    getAllInvitations: build.query<InvitationDTO[], unknown>({
      query: () => ({
        url: "/invitations",
        method: "GET",
      }),
      providesTags: ["Invitations"],
    }),
    getInvitationsBySponsorId: build.query<InvitationDTO[], string | undefined>(
      {
        query: (sponsorId) => ({
          url: "/invitations",
          method: "GET",
          params: { sponsorId },
        }),
        providesTags: ["Invitations"],
      }
    ),
    invitationSave: build.mutation<InvitationDTO, Invitation>({
      query: (data) => ({
        url: `/invitations`,
        method: "POST",
        body: data,
      }),
    }),
    manyInvitationsSave: build.mutation<InvitationDTO[], Invitation[]>({
      query: (data) => ({
        url: `/invitations/batch`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: build.mutation<UserDTO, { id: string; user: Partial<User> }>({
      invalidatesTags: ["User"],
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
    deleteUser: build.mutation<{ success: boolean },string>({
      invalidatesTags: ["User", "Users"],
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useInvitationSaveMutation,
  useGetAllUsersQuery,
  useLazyGetUsersBySponsorIdQuery,
  useLazyGetUsersByCommunityIdQuery,
  useLazyGetInvitationsBySponsorIdQuery,
  useGetAllInvitationsQuery,
  useManyInvitationsSaveMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  util: { getRunningOperationPromises, resetApiState },
} = userApi;

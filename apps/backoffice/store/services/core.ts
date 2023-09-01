import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { auth } from "../../firebase";
import { API_URL } from "../../constants";

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;

    if (!user) return headers;

    const token = await user.getIdToken();
    headers.append("Authorization", `Bearer ${token}`);
    return headers;
  },
});

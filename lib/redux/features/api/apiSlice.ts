import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";
import { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: (token) => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include" as const,
        headers: {
          Authorization: `${token}`, // Ajouter l'en-tête d'autorisation directement ici
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});


// export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
export const {  useLoadUserQuery } = apiSlice;

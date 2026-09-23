import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create all endpoints related to authentication here
    userLogin: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
    }),

    userRegistration: builder.mutation({
      query: (formData) => ({
        url: `/auth/register`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUserLoginMutation, useUserRegistrationMutation } = authApi;

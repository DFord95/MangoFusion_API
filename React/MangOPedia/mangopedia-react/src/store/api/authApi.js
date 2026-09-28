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

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/ForgotPassword",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/ResetPassword",
        method: "POST",
        body: formData,
      }),
    }),

    confirmEmail: builder.mutation({
      query: (formData) => ({
        url: "/auth/ConfirmEmail",
        method: "POST",
        body: formData,
      }),
    }),

    resendConfirmation: builder.mutation({
      query: (email) => ({
        url: "/auth/ResendConfirmation",
        method: "POST",
        body: { email },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUserLoginMutation,
  useUserRegistrationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
} = authApi;

import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create all endpoints related to menu items here
    getOrders: builder.query({
      query: (userId = "") => ({
        url: `/OrderHeaders`,
        params: {
          ...(userId ? { userId } : {}),
        },
      }),
      providesTags: ["Order"],
      transformResponse: (response) => {
        if (response && response.result && Array.isArray(response.result)) {
          return response.result;
        }

        if (response && Array.isArray(response)) {
          return response;
        }

        return [];
      },
    }),

    getOrderById: builder.query({
      query: (id) => `/OrderHeaders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
      transformResponse: (response) => {
        if (response && response.result) {
          return response.result;
        }

        return response;
      },
    }),

    createOrder: builder.mutation({
      query: (formData) => ({
        url: "/OrderHeaders",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Order"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/OrderHeaders/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderApi;

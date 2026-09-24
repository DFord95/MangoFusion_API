import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, STORAGE_KEYS } from "../../utilities/constants";

// Base API configuration for the application

// Base query with authentication and error handling
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL + "/api",

  prepareHeaders: (headers, { getState }) => {
    // Add authentication headers if needed
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, _api, extraOptions) => {
  // Implement your base query with authentication logic here
  const result = await baseQuery(args, _api, extraOptions);

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [],
  endpoints: () => ({}), // Endpoints defined in separate  API files/modules
});

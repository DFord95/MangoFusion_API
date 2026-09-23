import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { menuItemsApi } from "./api/menuItemApi";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [menuItemsApi.reducerPath]: menuItemsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  // Add auth middleware if needed in the future
  // Example: getDefaultMiddleware().concat(authMiddleware),
});

export default store;

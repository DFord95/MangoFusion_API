import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { menuItemsApi } from "./api/menuItemApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [menuItemsApi.reducerPath]: menuItemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;

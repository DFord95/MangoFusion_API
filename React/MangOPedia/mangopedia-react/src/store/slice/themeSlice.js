import { createSlice } from "@reduxjs/toolkit";

const getInitialState = {
  theme: localStorage.getItem("bs-theme-fusion") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: { ...getInitialState },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("bs-theme-fusion", state.theme);

      document.body.setAttribute("data-bs-theme", state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("bs-theme-fusion", state.theme);
      document.body.setAttribute("data-bs-theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

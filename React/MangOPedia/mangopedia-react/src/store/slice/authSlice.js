import { createSlice } from "@reduxjs/toolkit";
import { getUserInfoFromJWT, isJWTValid } from "../../utilities/jwtDecoder";
import { STORAGE_KEYS } from "../../utilities/constants";

const getInitialAuthState = () => {
  const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  // Check if the token is invalid or not present and clear localStorage if so
  if (
    !storedToken ||
    storedToken === "undefined" ||
    storedToken === "null" ||
    isJWTValid(storedToken) === false
  ) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }

  let user = null;

  if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      // If user parsing fails, extract user info from the token
      user = getUserInfoFromJWT(storedToken);

      if (!user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    }
  }

  if (user) {
    return {
      user,
      token: storedToken,
      isAuthenticated: !!storedToken && !!user,
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: { ...getInitialAuthState() },
  reducers: {
    setAuthState: (state, action) => {
      const { user, token, isAuthenticated } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = !!(user && token);

      if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    clearAuthState: (state) => {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    },
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    },
  },
});

export const { setAuthState, clearAuthState, logout } = authSlice.actions;
export default authSlice.reducer;

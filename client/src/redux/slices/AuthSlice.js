import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance.js";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data") || {},
};

// thunk function to create new account
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = axiosInstance.post("/auth/register", data);
    toast.promise(res, {
      loading: "Wait! creating your account...",
      success: (response) => {
        return response?.data.message;
      },
      error: "Failed to create account",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// thunk function to login user
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("/auth/login", data);
    toast.promise(res, {
      loading: "Logging in...",
      success: (response) => {
        return response?.data.message;
      },
      error: "Login failed.",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// thunk function to logout user
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.get("/auth/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: (response) => {
        return response?.data?.message;
      },
      error: "Logout failed.",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // logic for handling login success
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem(
          "role",
          JSON.stringify(action?.payload?.user?.role)
        );
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        // logic for handling signup success
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem(
          "role",
          JSON.stringify(action?.payload?.user?.role)
        );
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        // logic for handling logout success
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      });
  },
});

export default authSlice.reducer;

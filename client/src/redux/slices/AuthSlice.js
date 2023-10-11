import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance  from "../../helpers/AxiosInstance.js";


const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || '',
    data: localStorage.getItem('data') || {}
}

// thunk function to create new account
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("/auth/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account...",
            success: (response) => {
                console.log(response.data);
                return response?.data.message;
            },
            error: "Failed to create account"
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

const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state,action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", JSON.stringify(action?.payload?.user?.role));
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
        })
    }
});

export const {} = authSlice.actions;
export default authSlice.reducer;
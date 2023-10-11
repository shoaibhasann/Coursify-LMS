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
        console.log((await res))
        toast.promise(res, {
            loading: "Wait! creating your account.",
            success: (response) => {
                console.log("toast success", data);
                return response?.data.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {}
});

export const {} = authSlice.actions;
export default authSlice.reducer;
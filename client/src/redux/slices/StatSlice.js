import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance"

const initialState = {
    allUsersCount: 0,
    subscribedUsersCount: 0
}

// thunk function to get stats data
export const getStatsData = createAsyncThunk("/stats/get", async (_, { rejectWithValue }) => {
    try {
        const response = axiosInstance.get("/admin/stats/users");
        toast.promise(response, {
            loading: "Getting stats...",
            success: (res) => {
                return res?.data?.message;
            },
            error: "Failed to load data."
        });
        return (await response).data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
})
const statSlice = createSlice({
    name: "stat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getStatsData.fulfilled, (state,action) => {
            state.allUsersCount = action?.payload?.allUsersCount;
            state.subscribedUsersCount = action?.payload?.subscribedUsersCount;
         });
    }
});

export default statSlice.reducer;
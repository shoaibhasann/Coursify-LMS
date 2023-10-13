import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance.js";


const initialState = {
    courseData: []
};

// thunk funciton to fetch all courses
export const fetchCourses = createAsyncThunk("/courses/all", async () => {
    try {
        const res = axiosInstance.get("/courses");
        toast.promise(res, {
            loading: "Loading courses...",
            success: "Courses loaded successfully.",
            error: "Failed to load courses."
        });
        return (await res).data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCourses.fulfilled, (state, action) => {
            if(action.payload){
                state.courseData = [...action.payload];
            }
        })
    }
});

export default courseSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance";

const initialState = {
    lectures: []
}

// thunk function to get lectures of course
export const getCourseLecture = createAsyncThunk("/course/lecture/get", async (cid, { rejectWithValue }) => {
    try {
        const res = axiosInstance.get(`/courses/${cid}`);
        toast.promise(res, {
            loading: "Fetching course lectures...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to fetched lectures."
        });
        return (await res).data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

// thunk function to add lecture
export const addCourseLecture = createAsyncThunk("/course/lecture/add", async(data, { rejectWithValue }) => {
    try {

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("lecture", data.lecture);

        const res = axiosInstance.post(`/courses/${data.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        toast.promise(res, {
            loading: "Adding lecture...",
            success: (response) => {
                return response?.data?.message
            },
            error: "Failed to add lecture."
        });
        return (await res).data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

// thunk to delete lecture from course
export const deleteCourseLecture = createAsyncThunk("/course/lecture/delete", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(res, {
            loading: "Deleting lecture...",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to delete lecture."
        });
        return (await res).data;
    } catch (error) {
        rejectWithValue(error?.response?.data?.message);
    }
})

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getCourseLecture.fulfilled, (state,action) => {
            state.lectures = action?.payload?.lectures;
         })
         .addCase(addCourseLecture.fulfilled, (state,action) => {
            state.lectures = action?.payload?.course?.lectures;
         })
    }
});

export default lectureSlice.reducer;

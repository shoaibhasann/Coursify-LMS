import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance.js";

const initialState = {
  courseData: [],
};

// thunk funciton to fetch all courses
export const fetchCourses = createAsyncThunk("/courses/all", async () => {
  try {
    const res = axiosInstance.get("/courses");
    toast.promise(res, {
      loading: "Loading courses...",
      success: "Courses loaded successfully.",
      error: "Failed to load courses.",
    });
    return (await res).data.courses;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// thunk function to create new course
export const createNewCourse = createAsyncThunk(
  "/course/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.promise(res, {
        loading: "Creating course...",
        success: "Course created successfully",
        error: "Failed to create course",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// thunk function to delete course
export const deleteCourse = createAsyncThunk("/courses/delete", async (id) => {
  try {
    const res = axiosInstance.delete(`/courses/${id}`);
    toast.promise(res, {
      loading: "Deleting course...",
      success: "Course deleted successfully.",
      error: "Failed to delete course.",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      if (action.payload) {
        state.courseData = [...action.payload];
      }
    });
  },
});

export default courseSlice.reducer;

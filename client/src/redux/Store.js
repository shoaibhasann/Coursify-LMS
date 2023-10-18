import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./slices/AuthSlice.js";
import courseSliceReducer from "./slices/CourseSlice.js";
import lectureSliceReducer from "./slices/LectureSlice.js";
import razorpaySliceReducer from "./slices/RazorpaySlice.js";
import statSliceReducer from "./slices/StatSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    courses: courseSliceReducer,
    razorpay: razorpaySliceReducer,
    lecture: lectureSliceReducer,
    stat: statSliceReducer,
  },
  devTools: true,
});

export default store;

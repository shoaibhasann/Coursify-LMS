import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./slices/AuthSlice.js";
import courseSliceReducer from "./slices/CourseSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    courses: courseSliceReducer,
  },
  devTools: true,
});

export default store;

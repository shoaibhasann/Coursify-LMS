import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance.js";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
};

// thunk function to get razorpay id
export const getRazorpayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/apikey");
        return response.data;
    } catch (error) {
        toast.error("Failed to get id.")
    }
});

// thunk function to buy subscription
export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/subscribe");
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// thunk function to verify user payment
export const verifyUserPayment = createAsyncThunk("/verifyPayment", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return rejectWithValue(error?.response?.data?.message);
    }
});

// thunk function to get payment records
export const getPaymentRecords = createAsyncThunk("/payment/records", async () => {
    try {
        const response = axiosInstance.get("/payments?count=100");

        toast.promise(response, {
            loading: "Fetching payment records...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to get payment records."
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// thunk function to cancel subscription
export const cancelCourseBundle = createAsyncThunk("/cancelSubscription", async () => {
    try {
        const response = axiosInstance.post("/payments/unsubscribe");

        toast.promise(response, {
            loading: "Wait! a moment...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to cancel subscription"
        });

        return (await response).data;
    } catch (error) {
         toast.error(error?.response?.data?.message);
    }
})

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getRazorpayId.fulfilled, (state, action) => {
            state.key = action?.payload?.key
         })
         .addCase(purchaseCourseBundle.fulfilled, (state,action) => {
            state.subscription_id = action?.payload?.subscription_id
         })
         .addCase(verifyUserPayment.fulfilled, (state,action) => {
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success
         })
         .addCase(verifyUserPayment.rejected,(state,action) => {
                        toast.success(action?.payload?.message);
                        state.isPaymentVerified = action?.payload?.success;
         })
         .addCase(getPaymentRecords.fulfilled, (state,action) => {
            state.allPayments = action?.payload?.payments
         })
    }
});

export default razorpaySlice.reducer
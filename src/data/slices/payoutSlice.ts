import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {common} from "../utils.ts";



const API_URL = `${common.baseUrl}/api/v1/payouts`;


interface PayoutState {
    withdrawalAccount: any;
    banks: any[];
    payout: any;
    payouts: any[];
    loading: boolean;
    error: string | null;
}

const initialState: PayoutState = {
    withdrawalAccount: null,
    banks: [],
    payout: null,
    payouts: [],
    loading: false,
    error: null,
};


export const addWithdrawalAccount = createAsyncThunk(
    'payout/addWithdrawalAccount',
    async (withdrawalData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/account/create`, withdrawalData);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error adding withdrawal account');
            }
        }
    }
);

export const getPaystackBanks = createAsyncThunk(
    'payout/getPaystackBanks',
    async (currency:string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/banks`, {
                params: { currency },
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting Paystack banks');
            }
        }
    }
);

export const getWithdrawalAccount = createAsyncThunk(
    'payout/getWithdrawalAccount',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/account/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting withdrawal account');
            }
        }
    }
);

export const deleteWithdrawalAccount = createAsyncThunk(
    'payout/deleteWithdrawalAccount',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/account/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error deleting withdrawal account');
            }
        }
    }
);

export const requestPayout = createAsyncThunk(
    'payout/requestPayout',
    async (payoutData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/create`, payoutData);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error requesting payout');
            }
        }
    }
);

export const getPayouts = createAsyncThunk(
    'payout/getPayouts',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${userId}`);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting payouts');
            }
        }
    }
);

// Define the slice with initial state and extraReducers to handle the thunks
const PayoutSlice = createSlice({
    name: "payout",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(addWithdrawalAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addWithdrawalAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawalAccount = action.payload;
            })
            .addCase(addWithdrawalAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getPaystackBanks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaystackBanks.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload.data;
            })
            .addCase(getPaystackBanks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getWithdrawalAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWithdrawalAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawalAccount = action.payload.data;
            })
            .addCase(getWithdrawalAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteWithdrawalAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWithdrawalAccount.fulfilled, (state) => {
                state.loading = false;
                state.withdrawalAccount = null;
            })
            .addCase(deleteWithdrawalAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Handle requestPayout
            .addCase(requestPayout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestPayout.fulfilled, (state, action) => {
                state.loading = false;
                state.payout = action.payload.data;
            })
            .addCase(requestPayout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Handle getPayouts
            .addCase(getPayouts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPayouts.fulfilled, (state, action) => {
                state.loading = false;
                state.payouts = action.payload.data;
            })
            .addCase(getPayouts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default PayoutSlice.reducer;
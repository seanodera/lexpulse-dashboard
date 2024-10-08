import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { common } from "../utils.ts";
import { getConfig } from "../eventData.ts";
import {Transaction, Wallet} from "../types.ts";
import {RootState} from "../../store.ts";

// Async thunk for fetching transactions
export const fetchTransactions = createAsyncThunk('transaction/fetch', async (id:string) => {
    try {
        const response = await axios.get(`${common.baseUrl}/api/v1/transactions/host/${id}`, getConfig());
        console.log(response);
        if (response.status === 200) {
            return response.data.data;
        }
    } catch (e) {
        console.error(e);
        throw e;  // This will dispatch the rejected action
    }
});

export const fetchUserWallets = createAsyncThunk('transaction/wallets', async (id:string) => {
    try {
        const response = await axios.get(`${common.baseUrl}/api/v1/transactions/wallets/${id}`,getConfig())
        console.log(response);
        if (response.status === 200) {
            return response.data.data;
        } else return []
    } catch (e) {
        console.error(e);
        throw e;  // This will dispatch the rejected action
    }
})

// Transaction slice definition
const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [] as Transaction[],
        wallets: [] as Wallet[],
        status: 'idle',
        loading: false,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
       builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            })
            .addCase(fetchUserWallets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserWallets.fulfilled, (state, action) => {
                state.loading = false;
                state.wallets = action.payload;
            })
            .addCase(fetchUserWallets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const selectWallets = (state: RootState) => state.transaction.wallets;
export const selectTransactions = (state:RootState) => state.transaction.transactions;
export default transactionSlice.reducer;
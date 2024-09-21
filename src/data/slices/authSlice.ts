// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '../types.ts'; // Ensure the path to your User type is correct

const baseUrl = import.meta.env.VITE_API_HOST_URL;

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

interface SignInPayload {
    email: string;
    password: string;
}

interface SignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface UpdateUserPayload {
    id: string;
    userData: Partial<User>;
}

interface ResetPasswordPayload {
    email: string;
}

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

// Utility functions for managing cookies
const setAuthCookies = (token: string, user: User) => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

const clearAuthCookies = () => {
    Cookies.remove('token');
    Cookies.remove('user');
};

// Thunk for signing in
export const signInHost = createAsyncThunk<{ token: string; user: User }, SignInPayload>(
    'auth/signIn',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const raw = JSON.stringify({ email, password });
            const config = { headers: { 'Content-Type': 'application/json' } };

            const res = await axios.post(`${baseUrl}/api/v1/auth`, raw, config);

            if (res.status === 200) {
                const { token, user } = res.data;
                setAuthCookies(token, user);
                return { token, user };
            } else {
                return rejectWithValue(res.data.msg);
            }
        } catch (e:any) {
            return rejectWithValue(e.response?.data?.msg || 'Unknown error');
        }
    }
);

// Thunk for signing up
export const signUpHost = createAsyncThunk<{ token: string; user: User }, SignUpPayload>(
    'auth/signUp',
    async ({ firstName, lastName, email, password }, { dispatch, rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('username', `${firstName}.${lastName}`);
            formData.append('email', email);
            formData.append('password', password);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            const res = await axios.post(`${baseUrl}/api/v1/users`, formData, config);

            if (res.status === 200) {
                const signInRes = await dispatch(signInHost({ email, password })).unwrap();
                return signInRes;
            } else {
                return rejectWithValue(res.data.msg);
            }
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.msg || 'Unknown error');
        }
    }
);

// Thunk for updating user
export const updateUser = createAsyncThunk<User, UpdateUserPayload>(
    'auth/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };

            const res = await axios.put<User>(`${baseUrl}/api/v1/users/${id}`, userData, config);

            if (res.status === 200) {
                const updatedUser = res.data;
                setAuthCookies(<string>token, updatedUser); // Update in cookies
                return updatedUser;
            } else {
                return rejectWithValue(res.data);
            }
        } catch (e: any) {
            return rejectWithValue(e.response?.data || 'Unknown error');
        }
    }
);

// Thunk for resetting password
export const resetPassword = createAsyncThunk<void, ResetPasswordPayload>(
    'auth/resetPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const raw = JSON.stringify({ email });
            const config = { headers: { 'Content-Type': 'application/json' } };

            const res = await axios.post(`${baseUrl}/api/v1/auth/reset-password`, raw, config);

            if (res.status === 200) {
                return res.data;
            } else {
                return rejectWithValue(res.data);
            }
        } catch (e: any) {
            return rejectWithValue(e.response?.data || 'Unknown error');
        }
    }
);

// Thunk for changing password
export const changePassword = createAsyncThunk<void, ChangePasswordPayload>(
    'auth/changePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const token = Cookies.get('token');
            const raw = JSON.stringify({ currentPassword, newPassword });
            const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };

            const res = await axios.post(`${baseUrl}/api/v1/auth/change-password`, raw, config);

            if (res.status === 200) {
                return res.data;
            } else {
                return rejectWithValue(res.data);
            }
        } catch (e: any) {
            return rejectWithValue(e.response?.data || 'Unknown error');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            state.token = null;
            clearAuthCookies();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInHost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInHost.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signInHost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signUpHost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpHost.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signUpHost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
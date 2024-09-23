import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';
import {EventModel, Venue} from '../types.ts';
import {common} from '../utils.ts';
import {RootState} from "../../store.ts";


interface VenueState {
    venues: Venue[];
    searchedVenues: Venue[];
    venue: Venue | null;
    loading: boolean;
    error: string | null;
    venueEvents: {[ key: string ]: EventModel[];}
}

const initialState: VenueState = {
    venues: [],
    searchedVenues: [],
    venue: null,
    loading: false,
    error: null,
    venueEvents: {}
};

// Utility to get request headers with token
const getRequestHeaders = () => {
    const token = Cookies.get('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Thunks to handle async operations
export const addVenue = createAsyncThunk(
    'venues/addVenue',
    async (venueData: FormData, {rejectWithValue}) => {
        try {
            const config = {
                ...getRequestHeaders(),
                headers: {...getRequestHeaders().headers, 'Content-Type': 'multipart/form-data'}
            };
            const response = await axios.post(`${common.baseUrl}/api/v1/venues`, venueData, config);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to add venue');
            }
            return rejectWithValue('Failed to add venue');
        }
    }
);

export const searchVenues = createAsyncThunk(
    'venues/searchVenues',
    async (term: string, {rejectWithValue}) => {
        try {
            const config = getRequestHeaders();
            const response = await axios.get(`${common.baseUrl}/api/v1/venues/search?term=${term}`, config);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to search venues');
            }
            return rejectWithValue('Failed to search venues');
        }
    }
);

export const fetchVenueById = createAsyncThunk(
    'venues/fetchVenueById',
    async (id: string, {rejectWithValue}) => {
        try {
            const config = getRequestHeaders();
            const response = await axios.get(`${common.baseUrl}/api/v1/venues/${id}`, config);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to fetch venue');
            }
            return rejectWithValue('Failed to fetch venue');
        }
    }
);

export const fetchUserVenues = createAsyncThunk(
    'venues/fetchUserVenues', async (id: string) => {
        const config = getRequestHeaders();
        const response = await axios.get(`${common.baseUrl}/api/v1/venues/user/${id}`, config);
        return response.data.data;

    }
)
export const updateVenue = createAsyncThunk(
    'venues/updateVenue',
    async ({id, updates}: { id: string, updates: Venue }, {rejectWithValue}) => {
        try {
            const config = getRequestHeaders();
            const response = await axios.put(`${common.baseUrl}/api/v1/venues/${id}`, updates, config);
            return response.data.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to update venue');
            }
            return rejectWithValue('Failed to update venue');
        }
    }
);

export const deleteVenue = createAsyncThunk(
    'venues/deleteVenue',
    async (id: string, {rejectWithValue}) => {
        try {
            const config = getRequestHeaders();
            await axios.delete(`${common.baseUrl}/api/v1/venues/${id}`, config);
            return {id};
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to delete venue');
            }
            return rejectWithValue('Failed to delete venue');
        }
    }
);

export const getVenueEvents = createAsyncThunk(
    'venues/getVenueEvents', async (id: string,{rejectWithValue}) => {
        try {
            const config = getRequestHeaders();
            const response = await axios.get(`${common.baseUrl}/api/v1/venues/${id}/events`, config);
            return {id: id, events: response.data.data};
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.error || 'Failed to fetch venue events');
            }
            return rejectWithValue('Failed to fetch venue events');
        }
    }
)


export const setFocusVenue = createAsyncThunk('venues/focus', async (id:string,{getState, rejectWithValue}) => {
    try {
        const {venue, auth} = getState() as RootState
        const selectedVenue = venue.venues.find((v) => v._id === id);
        if (selectedVenue){
            return selectedVenue;
        } else {
            const config = getRequestHeaders();
            const response = await axios.get(`${common.baseUrl}/api/v1/venues/${id}`, config);
            const gottenVenue = response.data.data;
            if (auth.user && gottenVenue.userId === auth.user.id){
                return gottenVenue;
            } else {
                rejectWithValue('Not your registered Venue')
            }
            
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch venue');
        }
        return rejectWithValue('Failed to fetch venue');
    }
})

const venueSlice = createSlice({
    name: 'venues',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVenue.fulfilled, (state, {payload}) => {
                state.venues.push(payload);
                state.loading = false;
            })
            .addCase(addVenue.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(searchVenues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchVenues.fulfilled, (state, {payload}) => {
                state.searchedVenues = payload;
                state.loading = false;
            })
            .addCase(searchVenues.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(fetchVenueById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVenueById.fulfilled, (state, {payload}) => {
                state.venue = payload;
                state.loading = false;
            })
            .addCase(fetchVenueById.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(fetchUserVenues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserVenues.fulfilled, (state, action) => {
                state.loading = false;
                state.venues = action.payload;
            })
            .addCase(fetchUserVenues.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to fetch venues'
            })

            .addCase(updateVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVenue.fulfilled, (state, {payload}) => {
                const index = state.venues.findIndex((venue) => venue._id === payload._id);
                if (index !== -1) {
                    state.venues[ index ] = payload;
                }
                state.loading = false;
            })
            .addCase(updateVenue.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(deleteVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVenue.fulfilled, (state, {payload}) => {
                state.venues = state.venues.filter((venue) => venue._id !== payload.id);
                state.loading = false;
            })
            .addCase(deleteVenue.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(setFocusVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setFocusVenue.fulfilled, (state, {payload}) => {
                state.venue = payload;
                state.loading = false;
            })
            .addCase(setFocusVenue.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })

            .addCase(getVenueEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVenueEvents.fulfilled, (state, {payload}) => {
                const index = state.venues.findIndex((venue) => venue._id === payload.id);
                if (index !== -1) {
                    state.venues[ index ].events = payload.events;
                }
                if (state.venue && state.venue._id === payload.id){
                    state.venue.events = payload.events;
                }
                state.loading = false;
            })
            .addCase(getVenueEvents.rejected, (state, {payload}) => {
                state.loading = false;
                state.error = payload as string;
            })
        ;
    }
});

export const selectVenues = (state: RootState) => state.venue.venues;
export const selectSearchedVenues = (state: RootState) => state.venue.searchedVenues;
export const selectCurrentVenue = (state: RootState) => state.venue.venue;
export const selectVenueLoading = (state: RootState) => state.venue.loading;
export const selectVenueError = (state: RootState) => state.venue.error;

export default venueSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store.ts";
import { EventModel } from "../types.ts";
import { getEvents, addEvent, getEvent, updateEvent, deleteEvent } from "../eventData.ts";

// Fetch events from API
export const fetchEvents = createAsyncThunk('events/fetch', async (id: string, { rejectWithValue }) => {
    try {
        const response = await getEvents(id);
        return response.data.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error fetching events');
        }
    }
});

// Fetch a single event by ID
export const fetchEventById = createAsyncThunk('events/fetchById', async (id: string, { rejectWithValue,getState }) => {
    try {
        const {events} = getState() as RootState;
        let event = events.events.find(e => e._id === id);
        if (!event) {
            const response = await getEvent(id);
            event = response.data.event;
        }
       return event;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error fetching event');
        }
    }
});

// Create a new event
export const createEvent = createAsyncThunk('events/create', async (event: EventModel, { rejectWithValue }) => {
    try {
        console.log(event);
        const response = await addEvent(event);
        console.log(response);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error creating event');
        }
    }
});

// Update an existing event
export const updateEventById = createAsyncThunk('events/update', async ({ id, eventData }: { id: string, eventData: Partial<EventModel> }, { rejectWithValue }) => {
    try {
        const response = await updateEvent(id, eventData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error updating event');
        }
    }
});

// Delete an event by ID
export const deleteEventById = createAsyncThunk('events/delete', async (id: string, { rejectWithValue }) => {
    try {
        const response = await deleteEvent(id);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error deleting event');
        }
    }
});


// Event slice state
interface EventState {
    events: EventModel[];
    focusEvent?: EventModel;
    fetching: boolean;
    fetchError: string | null;
}

const initialState: EventState = {
    events: [],
    focusEvent: undefined,
    fetching: false,
    fetchError: null,
};

const EventSlice = createSlice({
    name: "events",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all events
            .addCase(fetchEvents.pending, (state) => {
                state.fetching = true;
                state.fetchError = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload;
                state.fetching = false;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.fetching = false;
                state.fetchError = action.payload as string;
            })

            // Fetch single event by ID
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.focusEvent = action.payload;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Create event
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Update event
            .addCase(updateEventById.fulfilled, (state, action) => {
                const index = state.events.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEventById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Delete event
            .addCase(deleteEventById.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event._id !== action.meta.arg);
            })
            .addCase(deleteEventById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            });
    },
});

// Selectors
export const selectAllEvents = (state: RootState) => state.events.events;
export const selectFocusEvent = (state: RootState) => state.events.focusEvent;

export default EventSlice.reducer;

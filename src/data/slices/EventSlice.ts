import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store.ts";
import { EventModel, Scanner } from "../types.ts";
import {
    getEvents,
    addEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    addScanner,
    deleteScanner,
} from "../eventData.ts";


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
export const fetchEventById = createAsyncThunk('events/fetchById', async (id: string, { rejectWithValue, getState }) => {
    try {
        const { events } = getState() as RootState;
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
        const response = await addEvent(event);
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

// Add a new scanner
export const createScanner = createAsyncThunk('scanners/create', async (scanner: Scanner, { rejectWithValue }) => {
    try {
        const response = await addScanner(scanner);
        return response.data.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error creating scanner');
        }
    }
});

// Delete a scanner by ID
export const deleteScannerById = createAsyncThunk('scanners/delete', async (scannerId: string, { rejectWithValue }) => {
    try {
       await deleteScanner(scannerId);
        return scannerId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error deleting scanner');
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

            // Create new event
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Update event by ID
            .addCase(updateEventById.fulfilled, (state, action) => {
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEventById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Delete event by ID
            .addCase(deleteEventById.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event._id !== action.payload.id);
            })
            .addCase(deleteEventById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Create scanner
            .addCase(createScanner.fulfilled, (state, action) => {
                const eventIndex = state.events.findIndex((v) => v._id === action.payload.eventId)
                if (eventIndex !== -1){
                    state.events[eventIndex].scanners.push(action.payload);
                }
                if (state.focusEvent) {
                    state.focusEvent.scanners.push(action.payload);
                }
            })
            .addCase(createScanner.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            })

            // Delete scanner by ID
            .addCase(deleteScannerById.fulfilled, (state, action) => {

                if (state.focusEvent) {
                    const eventIndex = state.events.findIndex((v) => v._id === state.focusEvent!._id);
                    if (eventIndex !== -1) {
                        const index = state.focusEvent.scanners.findIndex((v) => v._id === action.payload);
                        if (index !== -1) {
                            state.focusEvent.scanners.splice(index, 1);
                        }
                        state.focusEvent = state.events[eventIndex];
                    }
                }
            })
            .addCase(deleteScannerById.rejected, (state, action) => {
                state.fetchError = action.payload as string;
            });
    },
});

// Selectors
export const selectAllEvents = (state: RootState) => state.events.events;
export const selectFocusEvent = (state: RootState) => state.events.focusEvent;

export default EventSlice.reducer;
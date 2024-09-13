import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {generateEvents} from "../generator.ts";
import {faker} from "@faker-js/faker";
import {RootState} from "../../store.ts";
import {EventModel} from "../types.ts";


const fetchEvents = createAsyncThunk('events/fetch', async () => {

    return generateEvents(faker.number.int({max: 2, min: 1}));
});

export const setFocusEvent = createAsyncThunk<EventModel, string, { state: RootState }>(
    'events/focus',
    async (id, {getState}) => {
        const {events} = getState();
        let event = events.events.find(e => e.id === id);
        if (!event) {
            event = generateEvents(1)[ 0 ];
            event.id = id;
        }
        return event;
    }
);

export const createEvent = createAsyncThunk('events/create', async (event: EventModel, {getState}) => {
    const {events} = getState() as RootState;

    return [...events.events, {...event, id: faker.string.alphanumeric(8)}]
})

interface EventState {
    events: EventModel[];
    focusEvent?: EventModel;
    fetching: boolean;
    fetchError: string;
}

const initialState: EventState = {
    events: [],
    focusEvent: undefined,
    fetching: false,
    fetchError: '',
}

const EventSlice = createSlice({
    name: "events",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.pending, (state) => {
            state.fetching = true;
            state.fetchError = '';
        }).addCase(fetchEvents.fulfilled, (state, action) => {
            state.events = action.payload;
            state.fetching = false;
        }).addCase(fetchEvents.rejected, (state) => {
            state.fetching = false;
            state.fetchError = 'Error Getting Events'
        }).addCase(setFocusEvent.fulfilled, (state, action) => {
            state.focusEvent = action.payload;
        }).addCase(setFocusEvent.rejected, (state) => {
            state.fetchError = 'Error Setting Focus Event';
        }).addCase(createEvent.fulfilled, (state,action) => {
            state.events = action.payload;
        })
    }
})


export const selectAllEvents = (state: RootState) => state.events.events;
export const selectFocusEvent = (state: RootState) => state.events.focusEvent;
export default EventSlice.reducer;
export {fetchEvents}
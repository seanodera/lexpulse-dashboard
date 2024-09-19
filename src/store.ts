import { configureStore } from "@reduxjs/toolkit";
import EventReducer from './data/slices/EventSlice';
import transactionReducer from './data/slices/transactionSlice';

const store = configureStore({
    reducer: {
        events: EventReducer,
        transaction: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['your/action/type'],
                ignoredActionPaths: [
                    'meta.arg',
                    'payload.0.date',
                    'payload.0.createdAt',
                    'payload.*.date', // This will match any array of events with Date fields
                    'payload.*.startSalesDate',
                    'payload.*.endSalesDate',
                    'payload.*.eventEnd',
                    'payload.*.discount.start',
                    'payload.*.discount.end',
                    'payload.*.ticket.saleEnd',
                    'payload.*.ticket.saleStart'
                ],
                ignoredPaths: [
                    'events.focusEvent.date',
                    'events.focusEvent.createdAt',
                    'events.focusEvent.startSalesDate',
                    'events.focusEvent.endSalesDate',
                    'events.focusEvent.eventEnd',
                    'events.focusEvent.tickets.saleEnd',
                    'events.focusEvent.tickets.saleStart',
                    'events.focusEvent.discount.start',
                    'events.focusEvent.discount.end',
                    'events.events.*.date',
                    'events.events.*.startSalesDate',
                    'events.events.*.endSalesDate',
                    'events.events.*.eventEnd',
                    'events.events.*.discount.start',
                    'events.events.*.discount.end',
                    'events.events.*.ticket.saleEnd',
                    'events.events.*.ticket.saleStart'
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Events } from '../utils/types';

interface EventsState {
  events: Events[];
  selectedEvent: Events | null;
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    getEvents(state, action: PayloadAction<Events[]>) {
      state.events = action.payload;
    },
    getEvent(state, action: PayloadAction<Events>) {
      state.selectedEvent = action.payload;
    },
    addEvent(state, action: PayloadAction<Events>) {
      state.events.push(action.payload);
    },
    updateEvent(state, action: PayloadAction<Events>) {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent(state, action: PayloadAction<number>) {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent
} = eventsSlice.actions;

export default eventsSlice.reducer;

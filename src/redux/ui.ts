import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

interface Notification {
  id?: string;
  color?: string;
  message: string;
}

interface State {
  loading: boolean;
  notifications: Notification[],
}

const initialState: State = {
  loading: false,
  notifications: [],
};

const ui = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push({
        id: uuid(),
        message: action.payload.message,
        color: action.payload.color
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const {
  loading,
  addNotification,
  removeNotification,
} = ui.actions;

export default ui.reducer;

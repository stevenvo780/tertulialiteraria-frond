import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../utils/types';

interface AuthState {
  isLoggedIn: boolean;
  userData: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = auth.actions;

export default auth.reducer;

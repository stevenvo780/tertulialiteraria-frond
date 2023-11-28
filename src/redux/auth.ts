import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, ResponseData } from '../utils/types';

interface AuthState {
  isLoggedIn: boolean;
  userData: User | null;
  access_token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
  access_token: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<ResponseData>) {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
      state.access_token = action.payload.access_token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = auth.actions;

export default auth.reducer;

// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userId: null,
    token:null,
    isLoading: false,
    error: null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
   
  },
});

// export const { login, logout, setLoading} = authSlice.actions;
export const authActions = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  isLoggedIn: !!localStorage.getItem('userData'), 
  userData: JSON.parse(localStorage.getItem('userData')) || {}, 
  error: null
};


export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:3030/authentication', {
      ...credentials,
      strategy: "local"
    });
    localStorage.setItem('userData', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const register = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:3030/users', credentials);
      console.log('register response: ', response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = {};
      localStorage.removeItem('userData');
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'finished';
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;

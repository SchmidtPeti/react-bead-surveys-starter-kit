import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import surveyReducer from './surveySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        survey: surveyReducer
      },
});
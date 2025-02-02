import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import surveyReducer from './surveySlice';
import resultsReducer from './resultsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        survey: surveyReducer,
        results: resultsReducer,
      },
});

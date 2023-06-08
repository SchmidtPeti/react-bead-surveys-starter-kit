import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitAnswers = createAsyncThunk('results/submitAnswers', async ({answers, id}, thunkAPI) => {
    console.log('submitAnswers thunk: ', answers, id);
    try {
      const state = thunkAPI.getState(); 
      const userToken = state.auth.userData.accessToken;
      const surveyId = id;
      console.log('submitAnswers answers: ', answers, id);
  
      const response = await axios.post('http://localhost:3030/results', 
        { 
          content: JSON.stringify(answers),
          surveyId: surveyId
        }, 
        { 
          headers: { Authorization: `Bearer ${userToken}` } 
        });
  
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });
  
  export const fetchResults = createAsyncThunk('results/fetchResults', async (surveyId, thunkAPI) => {
    const state = thunkAPI.getState();
    const userToken = state.auth.userData.accessToken;
  
    try {
      const response = await axios.get(`http://localhost:3030/results?surveyId=${surveyId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('fetchResults response data: ', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });
  
const initialState = {
  results: null,
  status: 'idle',
  fetchResultsStatus: 'idle',
  error: null 
};

const resultsSlice = createSlice({
  name: 'results',
  initialState: initialState, 
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // add the results to the state
        state.results = action.payload;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchResults.pending, (state) => {
        state.fetchResultsStatus = 'loading';
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.fetchResultsStatus = 'succeeded';
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.fetchResultsStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default resultsSlice.reducer;

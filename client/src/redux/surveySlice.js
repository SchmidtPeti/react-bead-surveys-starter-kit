import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  error: null,
  surveys: [],
  survey: {} 
};

export const createSurvey = createAsyncThunk('survey/createSurvey', async (survey, thunkAPI) => {
    try {
      const { surveyName, surveyContent } = survey; // destructuring the survey object
      const state = thunkAPI.getState(); // getting the current state
      const userToken = state.auth.userData.accessToken; // retrieving user's token from auth state
      const userId = state.auth.userData.user.id; // retrieving user's ID from auth state
      console.log('createSurvey userId: ', userId,userToken );
      const response = await axios.post('http://localhost:3030/surveys', { name: surveyName, content: surveyContent, userId: userId }, { headers: { Authorization: `Bearer ${userToken}` } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });

  export const fetchSurveys = createAsyncThunk('survey/fetchSurveys', async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userToken = state.auth.userData.accessToken;
      const userId = parseInt(state.auth.userData.user.id); // parsing userId to number
      console.log('fetchSurveys userId: ', state.auth.userData.user.id);
      const response = await axios.get(`http://localhost:3030/surveys?userId=${userId}`, { 
        headers: { 
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json' 
        } 
      });
      console.log('fetchSurveys response data: ', response.data);
      return response.data;
    } catch (error) {
      console.log('fetchSurveys error: ', error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });
  export const fetchSurveyByHash = createAsyncThunk('survey/fetchSurveyByHash', async (hash, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userToken = state.auth.userData.accessToken;
      const response = await axios.get(`http://localhost:3030/surveys?hash=${hash}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSurvey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(fetchSurveys.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        state.status = 'idle';
        state.surveys = action.payload;
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      // Adding fetchSurveyByHash cases
      .addCase(fetchSurveyByHash.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSurveyByHash.fulfilled, (state, action) => {
        state.status = 'idle';
        state.survey = action.payload; // Storing the fetched survey in state
      })
      .addCase(fetchSurveyByHash.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      });
  },
});

export const selectSurvey = (state) => state.survey;

export default surveySlice.reducer;
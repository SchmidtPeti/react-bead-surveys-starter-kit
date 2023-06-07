import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  error: null,
  fetchSurveyByHashStatus: 'idle',
  modifySurveyStatus: 'idle',
  deleteSurveyStatus: 'idle',
  surveys: [],
  survey: {} 
};

export const createSurvey = createAsyncThunk('survey/createSurvey', async (survey, thunkAPI) => {
  try {
    const { surveyName, surveyContent } = survey; // destructuring the survey object
    const state = thunkAPI.getState(); // getting the current state
    const userToken = state.auth.userData.accessToken; // retrieving user's token from auth state
    
    // Notice that userId is not being sent in the request body anymore
    console.log('createSurvey userToken: ', userToken );
    const response = await axios.post('http://localhost:3030/surveys', 
      { 
        name: surveyName, 
        content: surveyContent, 
      }, 
      { 
        headers: { Authorization: `Bearer ${userToken}` } 
      });
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
      console.log("userToken:",userToken,"hash:", hash)
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
export const deleteSurvey = createAsyncThunk('survey/deleteSurvey', async (surveyId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const userToken = state.auth.userData.accessToken;
    await axios.delete(`http://localhost:3030/surveys/${surveyId}`, { 
      headers: { 
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json' 
      } 
    });
    return surveyId;
  } catch (error) {
    console.log('deleteSurvey error: ', error.response.data);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const modifySurvey = createAsyncThunk('survey/modifySurvey', async ({surveyId, newSurveyData}, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const userToken = state.auth.userData.accessToken;
    // Ensure that newSurveyData contains a `name` property instead of `title`
    if (newSurveyData.title) {
      newSurveyData.name = newSurveyData.title;
      delete newSurveyData.title;
    }
    const response = await axios.patch(`http://localhost:3030/surveys/${surveyId}`, 
      newSurveyData, 
      { 
        headers: { 
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json' 
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.log('modifySurvey error: ', error.response.data);
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
        state.fetchSurveyByHashStatus = 'loading';
      })
      .addCase(fetchSurveyByHash.fulfilled, (state, action) => {
        state.fetchSurveyByHashStatus = 'finished';
        state.survey = action.payload; // Storing the fetched survey in state
      })
      .addCase(fetchSurveyByHash.rejected, (state, action) => {
        state.fetchSurveyByHashStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteSurvey.pending, (state) => {
        state.deleteSurveyStatus = 'loading';
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.deleteSurveyStatus = 'idle';
        const stateCopy = JSON.parse(JSON.stringify(state));
        state.surveys = stateCopy.surveys.data.filter(survey => survey.id !== action.payload);
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.deleteSurveyStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(modifySurvey.pending, (state) => {
        state.modifySurveyStatus = 'loading';
      })
      .addCase(modifySurvey.fulfilled, (state, action) => {
        state.modifySurveyStatus = 'idle';
        // create a copy of the state for logging
        const stateCopy = JSON.parse(JSON.stringify(state));
        console.log("people should be happy", stateCopy.surveys);
        const index = stateCopy.surveys.data.findIndex(survey => survey.id === action.payload.id);
        if(index !== -1) {
          state.surveys[index] = action.payload;
        }
      })
      
      .addCase(modifySurvey.rejected, (state, action) => {
        state.modifySurveyStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectSurvey = (state) => state.survey;

export const selectSurveys = (state) => state.survey.surveys;


export default surveySlice.reducer;
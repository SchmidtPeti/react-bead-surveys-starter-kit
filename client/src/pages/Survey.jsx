import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { fetchSurveyByHash, selectSurvey } from '../redux/surveySlice';
import { login, selectAuth } from '../redux/authSlice'; 
import { submitAnswers } from '../redux/resultsSlice';

function Survey() {
  const { hash } = useParams();
  const dispatch = useDispatch();
  const { control, handleSubmit, watch } = useForm();
  const watchedAnswers = watch();

  const { isLoggedIn } = useSelector(selectAuth);
  const { survey, fetchSurveyByHashStatus, error } = useSelector(selectSurvey);

  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(login({email: 'anonymous@anonymous.hu', password: 'anonymous'}))
      .then(() => {
        if (fetchSurveyByHashStatus === 'idle') {
          dispatch(fetchSurveyByHash(hash));
        }
      });
    } else {
      if (fetchSurveyByHashStatus === 'idle') {
        dispatch(fetchSurveyByHash(hash));
      }
    }
  }, [dispatch, hash, isLoggedIn, fetchSurveyByHashStatus]);

  const getSteps = () => {
    return survey.data ? survey.data && survey.data[0].content.split('\n\n').map((page) => {
      const [pageTitle] = page.split('\n');
      return pageTitle;
    }) : [];
  };

  const getStepContent = (stepIndex) => {
    const page = survey.data && survey.data[0].content.split('\n\n')[stepIndex];
    const [, ...questions] = page.split('\n');
    return questions;
  };

  const onSubmit = (data) => {
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      const [_, pageIndex] = key.split("-");
  
      if (!acc[pageIndex]) {
        acc[pageIndex] = [];
      }
  
      acc[pageIndex].push(value);
      return acc;
    }, {});
  
    dispatch(submitAnswers({answers: processedData, id: survey.data[0].id}));
  };
  

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = getSteps();

  if (fetchSurveyByHashStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (fetchSurveyByHashStatus === 'failed' || !survey) {
    return <div>Error: {error || 'Survey not found'}</div>;
  }

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {activeStep === steps.length ? (
          <div>
            <Typography>All steps completed</Typography>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </div>
        ) : (
          steps.map((step, index) => (
            <div key={step} style={{ display: index === activeStep ? 'block' : 'none' }}>
              {getStepContent(index).map((question, qIndex) => (
                <Controller
                  key={`question-${qIndex}`}
                  name={`page-${index}-question-${qIndex}`}
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label={question} fullWidth margin="normal" variant="outlined" />}
                />
              ))}
              <div>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!watchedAnswers[`page-${index}-question-${getStepContent(index).length - 1}`]}>
                  {index === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          ))
        )}
      </form>
    </div>
  );
}

export default Survey;

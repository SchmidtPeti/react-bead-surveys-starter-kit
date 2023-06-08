import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../redux/resultsSlice';
import { fetchSurveyById } from '../redux/surveySlice';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';

function Responses() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const responses = useSelector(state => state.results.results);
  const survey = useSelector(state => state.survey.survey);
  
  useEffect(() => {
    if(id) {
      dispatch(fetchResults(id));
      dispatch(fetchSurveyById(id));
    }
  }, [id, dispatch]);

  if (!responses || !responses.data || responses.data.length === 0) {
    return <CircularProgress />;
  }

  const parsedResponses = responses ? responses.data.map((response) => JSON.parse(response.content)) : [];
  
  const pages = survey.content ? survey.content.split('\n\n') : [];
  const questions = pages.map(page => page.split('\n').slice(1)).flat();

  const answers = parsedResponses.map(obj => {
    let arr = [];
    for (let key in obj) {
      arr = arr.concat(obj[key]);
    }
    return arr;
  }).reduce((acc, curr) => curr.map((item, i) => (acc[i] || []).concat(item)), []);

  if (!answers || answers.length === 0 || !questions ||  questions.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>{survey.name}</Typography>
      {
        questions.map((question, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>{question}:</Typography>
              {
                answers[index] && answers[index].map((answer, aIndex) => (
                  <Typography key={aIndex} variant="body1">Response {aIndex + 1}: {answer}</Typography>
                ))
              }
            </CardContent>
          </Card>
        ))
      }
    </Container>
  );
}

export default Responses;

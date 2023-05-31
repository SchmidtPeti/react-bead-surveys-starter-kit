import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveyByHash, selectSurvey } from '../redux/surveySlice';

function Survey() {
  const { hash } = useParams();
  const dispatch = useDispatch();

  const { survey, status, error } = useSelector(selectSurvey);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSurveyByHash(hash));
    }
  }, [status, dispatch, hash]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{survey.title}</h1>
      <div>Kérdések</div>
    </div>
  );
}

export default Survey;

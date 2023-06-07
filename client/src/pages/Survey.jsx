import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveyByHash, selectSurvey } from '../redux/surveySlice';
import { login, selectAuth } from '../redux/authSlice'; 

function Survey() {
  const { hash } = useParams();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(selectAuth);
  const { survey, fetchSurveyByHashStatus, error } = useSelector(selectSurvey);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(login({email: 'anonymous@anonymous.hu', password: 'anonymous'}))
      .then(() => {
        if (fetchSurveyByHashStatus === 'idle') {
          console.log('fetching survey', hash);
          dispatch(fetchSurveyByHash(hash));
        }
      });
    } else {
      if (fetchSurveyByHashStatus === 'idle') {
        console.log('fetching survey', hash);
        dispatch(fetchSurveyByHash(hash));
      }
      console.log('survey', survey)
    }
  }, [dispatch, hash, isLoggedIn, fetchSurveyByHashStatus]);

  if (fetchSurveyByHashStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (fetchSurveyByHashStatus === 'failed' || !survey) {
    return <div>Error: {error || 'Survey not found'}</div>;
  }
  return (
    <div>
      {survey.data && (
        <div>{survey.data[0].name}</div>
      )}
      <br />
      {survey.data && 
        survey.data[0].content.split('\n\n').map((page, index) => {
          const [pageTitle, ...questions] = page.split('\n');
          return (
            <div key={`page-${index}`}>
              <h2>{pageTitle}</h2>
              {questions.map((question, qIndex) => (
                <input key={`question-${qIndex}`} type="text" placeholder={question} />
              ))}
            </div>
          );
        })
      }
    </div>
  );
  
}

export default Survey;
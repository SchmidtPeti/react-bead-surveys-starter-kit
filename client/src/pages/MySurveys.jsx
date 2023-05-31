import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveys, selectSurvey } from '../redux/surveySlice';

function MySurveys() {
  const dispatch = useDispatch();
  const { surveys } = useSelector(selectSurvey);
  console.log("i am so cute:", surveys);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, [dispatch]);

  const handleDelete = (surveyId) => {
    // TODO: delete the survey from the server
  };

  const handleCopyLink = async (hash) => {
    const url = `http://localhost:5173/survey/${hash}`;
    console.log(url);
    try {
      await navigator.clipboard.writeText(url);
      console.log('URL copied to clipboard');
    } catch (err) {
      console.log('Failed to copy URL: ', err);
    }
  };
  

  const handleEdit = (surveyId) => {
    // TODO: modify the survey
  };

  // Check if surveys.data exists and if it has length.
  if (!surveys || !surveys.data || surveys.data.length === 0) {
    return (
      <div>
        <h1>My Surveys</h1>
        <p>No surveys found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Surveys</h1>
      {/* Access the survey data from surveys.data */}
      {surveys.data.map((survey) => (
        <div key={survey.id}>
          <h2>
            <Link to={`/surveys/${survey.id}`}>{survey.name}</Link>
          </h2>
          <p>{new Date(survey.createdAt).toLocaleDateString()}</p>
          <button onClick={() => handleDelete(survey.id)}>Delete</button>
          <button onClick={() => handleCopyLink(survey.hash)}>Copy Link</button>
          <button onClick={() => handleEdit(survey.id)}>Edit</button>
          <Link to={`/surveys/${survey.id}/responses`}>View Responses</Link>
        </div>
      ))}
    </div>
  );
}

export default MySurveys;

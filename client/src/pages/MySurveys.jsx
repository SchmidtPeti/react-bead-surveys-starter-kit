import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveys, selectSurveys, selectSurvey, deleteSurvey, modifySurvey } from '../redux/surveySlice';

const SurveyItem = ({survey, handleDelete, handleCopyLink, handleEdit}) => {
  const [newSurveyName, setNewSurveyName] = useState(survey.name);
  const [newSurveyContent, setNewSurveyContent] = useState(survey.content);

  return (
    <div key={survey.id}>
      <h2>
        <Link to={`/surveys/${survey.id}`}>{survey.name}</Link>
      </h2>
      <p>{new Date(survey.createdAt).toLocaleDateString()}</p>
      <button onClick={() => handleDelete(survey.id)}>Delete</button>
      <button onClick={() => handleCopyLink(survey.hash)}>Copy Link</button>
      <button onClick={() => handleEdit(survey.id, {title: newSurveyName, content: newSurveyContent})}>Edit</button>
      <Link to={`/surveys/${survey.id}/responses`}>View Responses</Link>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleEdit(survey.id, {name: newSurveyName, content: newSurveyContent})
      }}>
        <input type="text" value={newSurveyName} onChange={(e) => setNewSurveyName(e.target.value)} />
        <textarea value={newSurveyContent} onChange={(e) => setNewSurveyContent(e.target.value)}>
        </textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

function MySurveys() {
  const dispatch = useDispatch();
  const surveys = useSelector(selectSurveys);
  const { modifySurveyStatus, deleteSurveyStatus } = useSelector(selectSurvey);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, [dispatch, modifySurveyStatus, deleteSurveyStatus]);

  const handleDelete = (surveyId) => {
    dispatch(deleteSurvey(surveyId));
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

  const handleEdit = (surveyId, newSurveyData) => {
    dispatch(modifySurvey({ surveyId, newSurveyData }));
  };

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
      {surveys.data.map((survey) => 
        <SurveyItem 
          key={survey.id} 
          survey={survey} 
          handleDelete={handleDelete} 
          handleCopyLink={handleCopyLink} 
          handleEdit={handleEdit} 
        />
      )}
    </div>
  );
}

export default MySurveys;
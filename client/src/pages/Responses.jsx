import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Responses() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // TODO: Lekérni a szerverről a kérdőívet és a válaszokat id alapján
    // setSurvey(surveyResponse)
    // setResponses(responsesResponse)
  }, [id]);

  if (!survey || !responses.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{survey.title}</h1>

      {survey.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          <h2>{page.title}</h2>

          {page.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <h3>{question}</h3>

              {responses.map((response, responseIndex) => (
                <p key={responseIndex}>{response[pageIndex]?.[questionIndex]}</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Responses;

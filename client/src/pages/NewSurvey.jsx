import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSurvey, selectSurvey } from "../redux/surveySlice";

function NewSurvey() {
  const [surveyCode, setSurveyCode] = useState("");
  const dispatch = useDispatch();
  const surveyStatus = useSelector(selectSurvey).status;

  const validateInput = () => {
    if (surveyCode.trim() === "") {
      alert("A kérdőív kódja nem lehet üres.");
      return false;
    }

    const sections = surveyCode.split("\n\n");
    if (sections.length < 2) {
      alert("A kérdőívnek legalább egy címének és egy lapjának kell lennie.");
      return false;
    }

    const title = sections[0].trim();
    if (title === "") {
      alert("A kérdőívnek címmel kell rendelkeznie.");
      return false;
    }

    const pages = sections.slice(1);
    for(let i = 0; i < pages.length; i++) {
      const pageLines = pages[i].split("\n");
      if(pageLines.length < 2) {
        alert(`A(z) ${i+1}. lapon legalább egy kérdésnek kell lennie.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    const sections = surveyCode.split("\n\n");
    const surveyName = sections[0].trim().split('\n')[0]; // again, we assume first line is title
    const surveyContent = sections.slice(1).join("\n\n"); // remaining sections are the content

    try {
      await dispatch(createSurvey({ surveyName, surveyContent }));
      alert("A kérdőív sikeresen mentve.");
      setSurveyCode("");
    } catch (error) {
      alert("Hiba történt a kérdőív mentése közben.");
    }
  };

  return (
    <div>
      <h1>Új kérdőív</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Kérdőív kód:
          <textarea
            value={surveyCode}
            onChange={(e) => setSurveyCode(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={surveyStatus === "loading"}>
          Mentés
        </button>
      </form>
    </div>
  );
}

export default NewSurvey;

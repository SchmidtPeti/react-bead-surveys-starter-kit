import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveys, selectSurveys, selectSurvey, deleteSurvey, modifySurvey } from '../redux/surveySlice';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SurveyItem = ({survey, handleDelete, handleCopyLink, handleEdit}) => {
  const [newSurveyName, setNewSurveyName] = useState(survey.name);
  const [newSurveyContent, setNewSurveyContent] = useState(survey.content);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  return (
    <ListItem key={survey.id}>
      <ListItemText
        primary={survey.name}
        secondary={new Date(survey.createdAt).toLocaleDateString()}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="edit" onClick={() => setOpenEditDialog(true)}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(survey.id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton edge="end" aria-label="copy-link" onClick={() => { handleCopyLink(survey.hash); setOpenSnackbar(true); }}>
          <LinkIcon />
        </IconButton>
        <IconButton edge="end" aria-label="view-responses">
          <Link to={`/responses/${survey.id}`}><VisibilityIcon /></Link>
        </IconButton>
      </ListItemSecondaryAction>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Survey</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEdit(survey.id, {name: newSurveyName, content: newSurveyContent});
            setOpenEditDialog(false);
          }}>
            <TextField margin="dense" label="Name" type="text" value={newSurveyName} onChange={(e) => setNewSurveyName(e.target.value)} fullWidth />
            <TextField margin="dense" label="Content" type="text" value={newSurveyContent} onChange={(e) => setNewSurveyContent(e.target.value)} fullWidth multiline rows={4} />
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
              <Button type="submit">Update</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard!"
      />
    </ListItem>
  );
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
      console.log('Copying URL to clipboard: ', url);
      await navigator.clipboard.writeText(url);
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
      <List>
        {surveys.data.map((survey) => 
          <SurveyItem 
            key={survey.id} 
            survey={survey} 
            handleDelete={handleDelete} 
            handleCopyLink={handleCopyLink} 
            handleEdit={handleEdit} 
          />
        )}
      </List>
    </div>
  );
}

export default MySurveys;

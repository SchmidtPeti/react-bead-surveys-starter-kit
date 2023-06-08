import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSurveys, fetchSurveys } from '../redux/surveySlice';
import { logout } from '../redux/authSlice';
import { Typography, Button, Paper, Card, CardContent } from '@mui/material';

function Profile() {
  const { userData, isLoggedIn } = useSelector((state) => state.auth);
  const {user} = userData
  const dispatch = useDispatch();
  const surveys = useSelector(selectSurveys);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchSurveys());
    }
  }, [isLoggedIn, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isLoggedIn) {
    return <Typography variant="h5" component="div">Not logged in</Typography>;
  }

  return (
    <Paper elevation={3} style={{ margin: '1rem', padding: '1rem' }}>
      {user.id && surveys.data ? 
        (
          <Card>
            <CardContent>
              <Typography variant="h4" component="div">Profile</Typography>
              <Typography variant="body1" component="p">Id: {user.id}</Typography>
              <Typography variant="body1" component="p">Name: {user.fullname}</Typography>
              <Typography variant="body1" component="p">Email: {user.email}</Typography>
              <Typography variant="body1" component="p">Number of Surveys: {surveys.data.length}</Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
            </CardContent>
          </Card>
        )
        :
        (
          <Typography variant="h5" component="div">Not logged in</Typography>
        )  
      }
    </Paper>
  );
}

export default Profile;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewSurvey from './pages/NewSurvey';
import MySurveys from './pages/MySurveys';
import Survey from './pages/Survey';
import Responses from './pages/Responses';
import Profile from './pages/Profile';
import { selectAuth, logout } from './redux/authSlice';
import theme from './theme';
import { Container } from '@mui/material';

function RoutesComponent({ setIsLoggedOut }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsLoggedOut(false);
    }
  }, [location, setIsLoggedOut]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new-survey" element={<NewSurvey />} /> 
      <Route path="/my-surveys" element={<MySurveys />} />
      <Route path="/" element={<Home />} />
      <Route path="/survey/:hash" element={<Survey />} />
      <Route path="/responses/:id" element={<Responses />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  const { isLoggedIn } = useSelector(selectAuth);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedOut(true);
  };
  
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
    {isLoggedOut && <Navigate to="/" />}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Kérdőívek</Link>
          </Typography>
          
          {isLoggedIn ? (
            <>
              <Button color="inherit"><Link to="/my-surveys" style={{ textDecoration: 'none', color: 'inherit' }}>Kérdőíveim</Link></Button>
              <Button color="inherit"><Link to="/new-survey" style={{ textDecoration: 'none', color: 'inherit' }}>Új kérdőív</Link></Button>
              <Button color="inherit"><Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profil</Link></Button>
              <Button color="inherit" onClick={handleLogout}>Kijelentkezés</Button>
            </>
          ) : (
            <>
              <Button color="inherit"><Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Regisztráció</Link></Button>
              <Button color="inherit"><Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Bejelentkezés</Link></Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{height: '100%'}}>
      <RoutesComponent setIsLoggedOut={setIsLoggedOut} />
      </Container>
    </Router>
    </ThemeProvider>
  );
}

export default App;

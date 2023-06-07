import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewSurvey from './pages/NewSurvey';
import MySurveys from './pages/MySurveys';
import Survey from './pages/Survey';
import Responses from './pages/Responses';
import Profile from './pages/Profile';
import { selectAuth, logout } from './redux/authSlice';

function App() {
  const { isLoggedIn } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <nav>
        <Link to="/" style={{ marginRight: '10px' }}>Kérdőívek</Link>

        {isLoggedIn ? (
          <>
            <Link to="/my-surveys" style={{ marginRight: '10px' }}>Kérdőíveim</Link>
            <Link to="/new-survey" style={{ marginRight: '10px' }}>Új kérdőív</Link>
            <Link to="/responses" style={{ marginRight: '10px' }}>Válaszok</Link>
            <Link to="/profile" style={{ marginRight: '10px' }}>Profil</Link>
            <button onClick={handleLogout}>Kijelentkezés</button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ marginRight: '10px' }}>Regisztráció</Link>
            <Link to="/login" style={{ marginRight: '10px' }}>Bejelentkezés</Link>
          </>
        )}
      </nav>

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
    </Router>
  );
}

export default App;

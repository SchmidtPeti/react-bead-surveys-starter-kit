import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth } from '../redux/authSlice';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { Alert } from '@mui/lab';
import { Navigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(null);
  const dispatch = useDispatch();
  const { error } = useSelector(selectAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.rejected.match(result)) {
      console.error("Login failed: ", result.payload);
      setLoginSuccess(false);
    } else if (login.fulfilled.match(result)) { 
      setLoginSuccess(true);
    }
  };

  if (loginSuccess) {
    return <Navigate to="/my-surveys" />;
  }
  return (
    <Card style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>Bejelentkezés</Typography>
        {loginSuccess && <Alert severity="success">Successfully Logged In!</Alert>}
        {error && <Alert severity="error">Login Error: {error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email cím"
            type="email"
            placeholder='Email cím'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Jelszó"
            placeholder='Jelszó'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>Bejelentkezés</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Login;

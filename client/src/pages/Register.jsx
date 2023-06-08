import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuth } from '../redux/authSlice';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { Alert } from '@mui/lab';
import { Navigate } from 'react-router-dom';

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector(selectAuth);
  const [registerSuccess, setRegisterSuccess] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({ email, password, fullname: fullName }));
    //decide wheter a user should be redirected to the login page or not

    if (register.rejected.match(result)) {
      console.error("Registration failed: ", result.payload);
      setRegisterSuccess(false);
    } else if (register.fulfilled.match(result)) {
      console.log("Registration successful!");
      setRegisterSuccess(true);
    }
  };
  if (registerSuccess) {
    return <Navigate to="/new-survey" />;
  }

  return (
    <Card style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>Regisztráció</Typography>
        {status === 'loading' && <Alert severity="info">Loading...</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Teljes név"
            type="text"
            placeholder='Teljes név'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email cím"
            placeholder='Email cím'
            type="email"
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
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>Regisztráció</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Register;

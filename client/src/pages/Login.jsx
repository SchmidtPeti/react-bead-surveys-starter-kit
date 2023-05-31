import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth } from '../redux/authSlice';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(null);
  const dispatch = useDispatch();
  const { error } = useSelector(selectAuth); // Adding error to your component

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

  return (
    <div>
      <h1>Bejelentkezés</h1>
      {loginSuccess && <p style={{color: 'green'}}>Successfully Logged In!</p>}
      {error && <p style={{color: 'red'}}>Login Error: {error}</p>} {/* Displaying error if exists */}
      <form onSubmit={handleSubmit}>
        <label>
          Email cím:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Jelszó:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Bejelentkezés</button>
      </form>
    </div>
  );
}

export default Login;

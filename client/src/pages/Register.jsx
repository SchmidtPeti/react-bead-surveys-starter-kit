import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/authSlice';

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ email, password, fullname: fullName }));
  };

  return (
    <div>
      <h1>Regisztráció</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Teljes név:
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </label>
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
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}

export default Register;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

function Profile() {
  const { userData, isLoggedIn } = useSelector((state) => state.auth);
  const {user} = userData
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isLoggedIn) {
    return <div>Not logged in</div>;
  }
  console.log(userData);

  return (
    <div>
      <h1>Profil</h1>
      <p>Id: {user.id}</p>
      <p>Név: {user.fullname}</p>
      <p>Email: {user.email}</p>
      <p>Kérdőívek száma: 0</p>
      <button onClick={handleLogout}>Kijelentkezés</button>
    </div>
  );
}

export default Profile;

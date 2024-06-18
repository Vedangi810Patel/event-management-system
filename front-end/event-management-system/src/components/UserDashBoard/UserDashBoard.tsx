import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const UserDashBoard = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h2>UserDashBoard</h2>

      <button onClick={handleLogout}> Log Out </button>
    </div>
  )
}

export default UserDashBoard;
import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const UserDashBoard = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(() => {
    if(!token) {
      navigate('/');
    }
  })

  return (
    <h2>UserDashBoard</h2>
  )
}

export default UserDashBoard;
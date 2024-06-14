import React from 'react'

const AdminDashBoard = () => {
  return (
    <div className='admin-container'>
      <div className='dashboard-controller'>
        <h2> Dash Board </h2>
      </div>
      <div className='user-controller'> 
        <h2> Users </h2>
      </div>
      <div className='event-controller'> 
        <h2> Events </h2>
      </div>
    </div>
  )
}

export default AdminDashBoard
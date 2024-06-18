import React, { useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import Dashboard from '../DashBoardAdmin/DashBoardAdmin';
import AllUsers from '../AllUsers/AllUsers';
import Events from '../EventCalendar/EventCalendar';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './AdminDashboard.css'; // Custom CSS for AdminDashboard

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container fluid className="admin-dashboard">
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={2} className="bg-dark sidebar">
          <div className="sidebar-header">
            <h2 className="text-light m-3">Admin Panel</h2>
          </div>
          <Nav className="flex-column mt-3">
            <Nav.Link as={Link} to="dashboard" className="sidebar-link">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="all-users" className="sidebar-link">All Users</Nav.Link>
            <Nav.Link as={Link} to="events" className="sidebar-link">Events</Nav.Link>
          </Nav>
          <Button variant="light" className="mt-auto w-100 logout-btn" onClick={handleLogout}>Logout</Button>
        </Col>

        {/* Main Content */}
        <Col md={10} className="main-content p-0">
          <div className="content-header bg-light p-3">
            <h2 className="m-0">Event Management System</h2>
          </div>
          <div className="content-body p-2">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="all-users" element={<AllUsers />} />
              <Route path="events" element={<Events />} />
            </Routes>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

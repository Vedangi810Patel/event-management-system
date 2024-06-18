import React, { useEffect  } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Dashboard from '../DashBoardAdmin/DashBoardAdmin';
import AllUsers from '../AllUsers/AllUsers';
import Events from '../EventCalendar/EventCalendar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(() => {
    if(!token) {
      navigate('/');
    }
  })

  return (
    <div>
      <Container fluid>
        <Row>
          <Col md={2} className="bg-light vh-120">
            <div>
              <h2> Menu </h2>
            </div>
            <Nav className="flex-column mt-3">
              <Nav.Link as={Link} to="dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="all-users">All Users</Nav.Link>
              <Nav.Link as={Link} to="events">Events</Nav.Link>
            </Nav>
          </Col>
          <Col md={10} className="mt-3">
            <div>
              <h2> Admin Dashboard </h2>
            </div>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="all-users" element={<AllUsers />} />
              <Route path="events" element={<Events />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;

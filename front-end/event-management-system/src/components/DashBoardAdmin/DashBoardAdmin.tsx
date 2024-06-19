import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const redirectToUserTab = () => {
        navigate('/admin/all-users');
    };

    const redirectToEventTab = () => {
        navigate('/admin/events');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <Button variant="primary" onClick={redirectToUserTab}>Go to User Tab</Button>

                <Button variant="primary" onClick={redirectToEventTab}>Go to Event Tab</Button>
            </div>
        </div>
    );
};

export default Dashboard;

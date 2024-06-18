import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    })

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard.</p>
        </div>
    );
};

export default Dashboard;

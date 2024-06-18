import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const AllUsers: React.FC = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    })

    const handleUpdate = async () => {

        const user_type = localStorage.getItem('user_type')

        console.log(user_type)
    }

    return (
        <div>
            <h1>All Users</h1>
            <p>List of all users.</p>
            <button onClick={handleUpdate}> Button </button>
        </div>
    );
};

export default AllUsers;

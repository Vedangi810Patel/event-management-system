import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form} from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';

interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    contact_no: number;
    profile_pic: string;
    user_type: string;
    account_status: string;
    isactive: number;
}

const AllUsers: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState<User[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [updatedUser, setUpdatedUser] = useState({
        user_name: '',
        user_email: '',
        contact_no: '',
        user_type: '',
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        }

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/all-users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user.user_id !== id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/updateUser/${selectedUser?.user_id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowUpdateModal(false);
            const response = await axios.get('http://localhost:5000/all-users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleEditModalOpen = (user: User) => {
        setSelectedUser(user);
        setUpdatedUser({
            user_name: user.user_name,
            user_email: user.user_email,
            contact_no: String(user.contact_no),
            user_type: user.user_type,
        });
        setShowUpdateModal(true);
    };

    const handleEditModalClose = () => {
        setSelectedUser(null);
        setUpdatedUser({
            user_name: '',
            user_email: '',
            contact_no: '',
            user_type: '',
        });
        setShowUpdateModal(false);
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Profile Picture</th>
                        <th>User Type</th>
                        <th>Account Status</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_name}</td>
                            <td>{user.user_email}</td>
                            <td>{user.contact_no}</td>
                            <td><img src={`http://localhost:5000/public/assets/${user.profile_pic}`} alt="Profile" width="50" height="50" /></td>
                            <td>{user.user_type}</td>
                            <td>{user.account_status}</td>
                            <td>{user.isactive === 1 ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditModalOpen(user)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => { setShowDeleteModal(true); setDeleteUserId(user.user_id); }}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDelete(deleteUserId!)}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUpdateModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUserName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.user_name}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, user_name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={updatedUser.user_email}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, user_email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContactNo">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.contact_no}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, contact_no: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserType">
                            <Form.Label>User Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={updatedUser.user_type}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, user_type: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllUsers;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button, Modal, Form, Card } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// interface User {
//     user_id: number;
//     user_name: string;
//     user_email: string;
//     contact_no: number;
//     profile_pic: string;
//     user_type: string;
//     account_status: string;
//     isactive: number;
// }

// const AllUsers: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const [users, setUsers] = useState<User[]>([]);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
//     const [showUpdateModal, setShowUpdateModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState<User | null>(null);
//     const [updatedUser, setUpdatedUser] = useState({
//         user_name: '',
//         user_email: '',
//         contact_no: '',
//         // user_type: '',
//         profilePicture: null as File | null
//     });

//     useEffect(() => {
//         if (!token) {
//             navigate('/');
//         }

//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:5000/all-users', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     const handleDelete = async (id: number) => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete(`http://localhost:5000/delete-user`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setUsers(users.filter(user => user.user_id !== id));
//             setShowDeleteModal(false);
//         } catch (error) {
//             console.error('Error deleting user:', error);
//         }
//     };

//     const handleUpdate = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('user_name', updatedUser.user_name);
//             formData.append('user_email', updatedUser.user_email);
//             formData.append('contact_no', updatedUser.contact_no.toString());
//             // formData.append('user_type', updatedUser.user_type);
//             if (updatedUser.profilePicture) {
//                 formData.append('profilePicture', updatedUser.profilePicture);
//             }

//             const token = localStorage.getItem('token');
//             await axios.post(`http://localhost:5000/updateUser`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setShowUpdateModal(false);
//             const response = await axios.get('http://localhost:5000/all-users', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setUsers(response.data);
//         } catch (error) {
//             console.error('Error updating user:', error);
//         }
//     };

//     const handleEditModalOpen = (user: User) => {
//         setSelectedUser(user);
//         setUpdatedUser({
//             user_name: user.user_name,
//             user_email: user.user_email,
//             contact_no: user.contact_no.toString(),
//             // user_type: user.user_type,
//             profilePicture: null
//         });
//         setShowUpdateModal(true);
//     };

//     const handleEditModalClose = () => {
//         setSelectedUser(null);
//         setUpdatedUser({
//             user_name: '',
//             user_email: '',
//             contact_no: '',
//             // user_type: '',
//             profilePicture: null
//         });
//         setShowUpdateModal(false);
//     };

//     const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setUpdatedUser({ ...updatedUser, profilePicture: e.target.files[0] });
//         }
//     };

//     return (
//         <div>
//             <div className="d-flex flex-wrap">
//                 {users.map(user => (
//                     <Card key={user.user_id} style={{ width: '18rem', margin: '1rem' }}>
//                         <Card.Img variant="top" src={`http://localhost:5000/public/assets/${user.profile_pic}`} alt="Profile" />
//                         <Card.Body>
//                             <Card.Title>{user.user_name}</Card.Title>
//                             <Card.Text>
//                                 <p><strong>Email:</strong> {user.user_email}</p>
//                                 <p><strong>Contact Number:</strong> {user.contact_no}</p>
//                                 <p><strong>User Type:</strong> {user.user_type}</p>
//                                 <p><strong>Account Status:</strong> {user.account_status}</p>
//                                 <p><strong>Active:</strong> {user.isactive === 1 ? 'Yes' : 'No'}</p>
//                             </Card.Text>
//                             <Button variant="warning" onClick={() => handleEditModalOpen(user)}>Edit</Button>{' '}
//                             <Button variant="danger" onClick={() => { setShowDeleteModal(true); setDeleteUserId(user.user_id); }}>Delete</Button>
//                         </Card.Body>
//                     </Card>
//                 ))}
//             </div>

//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Delete User</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
//                     <Button variant="danger" onClick={() => handleDelete(deleteUserId!)}>Delete</Button>
//                 </Modal.Footer>
//             </Modal>

            
//             <Modal show={showUpdateModal} onHide={handleEditModalClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit User</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group controlId="formUserName">
//                             <Form.Label>User Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={updatedUser.user_name}
//                                 onChange={(e) => setUpdatedUser({ ...updatedUser, user_name: e.target.value })}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="formUserEmail">
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control
//                                 type="email"
//                                 value={updatedUser.user_email}
//                                 onChange={(e) => setUpdatedUser({ ...updatedUser, user_email: e.target.value })}
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="formContactNo">
//                             <Form.Label>Contact Number</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={updatedUser.contact_no}
//                                 onChange={(e) => setUpdatedUser({ ...updatedUser, contact_no: e.target.value })}
//                             />
//                         </Form.Group>
//                         {/* <Form.Group controlId="formUserType">
//                             <Form.Label>User Type</Form.Label>
//                             <Form.Control
//                                 as="select"
//                                 value={updatedUser.user_type}
//                                 onChange={(e) => setUpdatedUser({ ...updatedUser, user_type: e.target.value })}
//                             >
//                                 <option value="user">User</option>
//                                 <option value="admin">Admin</option>
//                             </Form.Control>
//                         </Form.Group> */}
//                         <Form.Group controlId="formProfilePicture">
//                             <Form.Label>Profile Picture</Form.Label>
//                             <Form.Control
//                                 type="file"
//                                 onChange={handleProfilePictureChange}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
//                     <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default AllUsers;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Card } from 'react-bootstrap';
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
        user_id: 0,
        user_name: '',
        user_email: '',
        contact_no: '',
        user_type: '',
        profilePicture: null as File | null
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        }

        const fetchUsers = async () => {
            try {
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
    }, [token, navigate]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/delete-user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    user_id: deleteUserId
                }
            });
            console.log(`Delete : ${deleteUserId}`)
            setUsers(users.filter(user => user.user_id !== deleteUserId));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', updatedUser.user_id.toString());
            formData.append('user_name', updatedUser.user_name);
            formData.append('user_email', updatedUser.user_email);
            formData.append('contact_no', updatedUser.contact_no);
            formData.append('user_type', updatedUser.user_type);
            if (updatedUser.profilePicture) {
                formData.append('profilePicture', updatedUser.profilePicture);
            }

            await axios.post(`http://localhost:5000/updateUser`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
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
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            contact_no: user.contact_no.toString(),
            user_type: user.user_type,
            profilePicture: null
        });
        setShowUpdateModal(true);
    };

    const handleEditModalClose = () => {
        setSelectedUser(null);
        setUpdatedUser({
            user_id: 0,
            user_name: '',
            user_email: '',
            contact_no: '',
            user_type: '',
            profilePicture: null
        });
        setShowUpdateModal(false);
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUpdatedUser({ ...updatedUser, profilePicture: e.target.files[0] });
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap">
                {users.map(user => (
                    <Card key={user.user_id} style={{ width: '18rem', margin: '1rem' }}>
                        <Card.Img variant="top" src={`http://localhost:5000/public/assets/${user.profile_pic}`} alt="Profile" />
                        <Card.Body>
                            <Card.Title>{user.user_name}</Card.Title>
                            <Card.Text>
                                <p><strong>Email:</strong> {user.user_email}</p>
                                <p><strong>Contact Number:</strong> {user.contact_no}</p>
                                <p><strong>User Type:</strong> {user.user_type}</p>
                                <p><strong>Account Status:</strong> {user.account_status}</p>
                                <p><strong>Active:</strong> {user.isactive === 1 ? 'Yes' : 'No'}</p>
                            </Card.Text>
                            <Button variant="warning" onClick={() => handleEditModalOpen(user)}>Edit</Button>{' '}
                            <Button variant="danger" onClick={() => { setShowDeleteModal(true); setDeleteUserId(user.user_id); }}>Delete</Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
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
                        <Form.Group controlId="formProfilePicture">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleProfilePictureChange}
                            />
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

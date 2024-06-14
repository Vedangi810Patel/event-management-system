import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Registration: React.FC = () => {
    const [formData, setFormData] = useState({
        u_name: '',
        u_email: '',
        u_password: '',
        contact_no: '',
        profilePicture: null as File | null,
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({
                ...formData,
                profilePicture: e.target.files[0],
            });
        }
    };

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!formData.u_name) newErrors.push('Name is required');
        if (!formData.u_email) newErrors.push('Email is required');
        if (!formData.u_password) newErrors.push('Password is required');
        if (!formData.contact_no) newErrors.push('Contact number is required');
        if (!formData.profilePicture) newErrors.push('Profile picture is required');
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('u_name', formData.u_name);
        formDataToSubmit.append('u_email', formData.u_email);
        formDataToSubmit.append('u_password', formData.u_password);
        formDataToSubmit.append('contact_no', formData.contact_no);
        if (formData.profilePicture) {
            formDataToSubmit.append('profilePicture', formData.profilePicture);
        }

        try {
            const response = await axios.post('http://localhost:5000/registration', formDataToSubmit);
            setSuccessMessage('User registered successfully');
            setErrors([]);
            setFormData({
                u_name: '',
                u_email: '',
                u_password: '',
                contact_no: '',
                profilePicture: null,
            });
        } catch (error) {
            setErrors(['Failed to register user']);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToLogin = () => {
        navigate('/');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Register</Card.Title>
                            {errors.length > 0 && (
                                <Alert variant="danger">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>
                                            <i className="bi bi-person"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="u_name"
                                            value={formData.u_name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>
                                            <i className="bi bi-envelope"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            name="u_email"
                                            value={formData.u_email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>
                                            <i className="bi bi-lock"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            name="u_password"
                                            value={formData.u_password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                        />
                                        <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="formContactNo">
                                    <Form.Label>Contact Number</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>
                                            <i className="bi bi-telephone"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="contact_no"
                                            value={formData.contact_no}
                                            onChange={handleChange}
                                            placeholder="Enter your contact number"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="formProfilePic">
                                    <Form.Label>Profile Picture</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="profilePicture"
                                        onChange={handleFileChange}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                                </Button>
                            </Form>
                            <Button variant="link" onClick={handleGoToLogin} className="w-100 text-center">
                                Login
                            </Button>
                            <Button variant="link" className="w-100 text-center">
                                Forgot Password?
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Registration;


import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        u_email: '',
        u_password: '',
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

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!formData.u_email) newErrors.push('Email is required');
        if (!formData.u_password) newErrors.push('Password is required');
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

        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            setSuccessMessage('User logged in successfully');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_type', response.data.user_type);
            console.log('Token : ', response.data.token);
            console.log('User Type : ',response.data.user_type);

            if(response.data.user_type === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }

            setErrors([]);
        } catch (error) {
            setErrors(['Failed to login']);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToRegister = () => {
        navigate('/registration');
    };

    const handleForgotPassword = () => {
        navigate('/Forgot-password');
    }


    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Login</Card.Title>
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
                                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                                </Button>
                            </Form>
                            <Button variant="link" onClick={handleGoToRegister} className="w-100 text-center">
                                Register
                            </Button>
                            <Button variant="link" className="w-100 text-center" onClick={handleForgotPassword}>
                                Forgot Password?
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

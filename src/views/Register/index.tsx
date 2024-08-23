import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNotification } from '../../redux/ui';
import axios from '../../utils/axios';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Nuevo campo para el nombre
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', name: '' });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    let formErrors = { email: '', password: '', confirmPassword: '', name: '' };

    if (!validateEmail(email)) {
      formErrors.email = 'Formato de correo electrónico inválido';
    }

    if (password.length < 8) {
      formErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!name) {
      formErrors.name = 'El nombre es obligatorio';
    }

    if (formErrors.email || formErrors.password || formErrors.confirmPassword || formErrors.name) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/register', { email, password, name });
      if (response.status === 201) {
        dispatch(addNotification({ message: 'Registro exitoso', color: 'success' }));
        navigate('/login');
      } else {
        dispatch(addNotification({ message: 'El registro ha fallado', color: 'danger' }));
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setErrors({ ...errors, email: 'El correo electrónico ya está registrado' });
      } else {
        dispatch(addNotification({ message: error?.response?.data?.message || 'El registro ha fallado', color: 'danger' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={12}>
          <Card className="shadow-lg" style={{ maxWidth: '60vw', margin: '0 auto' }}>
            <Card.Body>
              <h2 className="text-center mb-4">Registro</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Nombre</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Introduce tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={!!errors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Introduce tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Introduce tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicConfirmPassword">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!errors.confirmPassword}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <br />
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Registrar'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;

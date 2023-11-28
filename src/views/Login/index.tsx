import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import api from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth';
import { ResponseData } from '../../utils/types';
import { addNotification } from '../../redux/ui';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post<ResponseData>('/auth/login', { email: email, password });
      dispatch(login(data.data));
      dispatch(addNotification({ message: 'Bienvenido', color: 'success' }));
    } catch (error: any) {
      console.error(error?.response?.data?.message)
      dispatch(addNotification({ message: 'Error al ingresar', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container>
      <Row>
        <Col sm="6" className="d-flex align-items-center justify-content-center" style={{ marginTop: "10%" }}>
          <Card style={{ width: '100%', padding: '20px', boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)', borderRadius: '5px' }}>
            <Card.Body>
              <Card.Title className="text-center">Iniciar sesión</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <br />
                <Button style={{ marginRight: 10 }} variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                </Button>
                <Button variant="secondary" onClick={handleRegister}>Registrarse</Button> {/* Botón para registrarse */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="6" className="d-flex align-items-center justify-content-center">
          {/* Aquí puedes poner la imagen que quieras */}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

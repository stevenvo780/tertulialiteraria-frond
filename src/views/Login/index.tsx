import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth';
import { addNotification } from '../../redux/ui';
import { auth } from '../../utils/firebase';
import firebase from 'firebase/compat/app';

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
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        dispatch(login({ id: user.uid, email: user.email, name: user.displayName, events: [] }));
        dispatch(addNotification({ message: 'Bienvenido', color: 'success' }));
        navigate('/home');
      }
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al iniciar sesión', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      if (user) {
        dispatch(login({ id: user.uid, email: user.email, name: user.displayName, events: [] }));
        dispatch(addNotification({ message: 'Bienvenido', color: 'success' }));
        navigate('/home');
      }
    } catch (error: any) {
      console.error(error?.message);
      dispatch(addNotification({ message: 'Error al iniciar sesión con Google', color: 'danger' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col sm="6" className="d-flex align-items-center justify-content-center" style={{ marginTop: "10%" }}>
          <Card style={{ width: '100%', padding: '20px', boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)', borderRadius: '5px' }}>
            <Card.Body>
              <Card.Title className="text-center">Iniciar Sesión</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Correo Electrónico"
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
                  {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>
                <Button variant="secondary" onClick={handleRegister}>Registrarse</Button>
                <br />
                <br />
                <Button variant="danger" onClick={signInWithGoogle} disabled={isLoading}>
                  {isLoading ? 'Cargando...' : 'Iniciar Sesión con Google'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="6" className="d-flex align-items-center justify-content-center">
          {/* Puedes colocar una imagen o contenido adicional aquí */}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

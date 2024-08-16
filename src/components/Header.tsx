import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/auth';
import routesConfig from '../config/routesConfig.json';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role || 'user');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const routesForRole = routesConfig.roleRoutes[userRole];

  return (
    <Navbar expand="lg" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', padding: '3px', backgroundColor: '#212120' }} variant="dark">
      <Container fluid className="pl-4 pr-4">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* Renderizando las rutas del usuario */}
            {routesForRole.map((route, index) => (
              <Nav.Link key={index} as={Link} to={route.path}>
                {route.name}
              </Nav.Link>
            ))}
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <Button variant="outline-danger" onClick={handleLogout}>Cerrar sesión</Button>
            ) : (
              <Button variant="outline-light" onClick={handleLoginRedirect}>Iniciar sesión</Button>
            )}
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

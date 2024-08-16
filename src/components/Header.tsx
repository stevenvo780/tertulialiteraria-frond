import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/auth';
import routesConfig from '../config/routesConfig.json';
import { FaTh } from 'react-icons/fa';

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
    <Navbar expand="lg" className="bg-transparent navbar-light" style={{ padding: '3px' }}>
      <Container fluid className="pl-4 pr-4">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {routesForRole.map((route, index) => {
              if (route.viewHeader === false) return null;
              return (
                <Nav.Link key={index} as={Link} to={route.path} className="custom-nav-link" style={{ color: "black" }}>
                  <p style={{ color: "black", margin: 0 }}>{route.name}</p>
                </Nav.Link>
              );
            })}
          </Nav>
          <Dropdown align="end">
            <Dropdown.Toggle as="span" id="dropdown-basic" className="d-flex align-items-center" style={{ cursor: 'pointer', marginInline: 10 }}>
              <FaTh size={20} className="custom-icon" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {isLoggedIn ? (
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
              ) : (
                <Dropdown.Item onClick={handleLoginRedirect}>Iniciar sesión</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

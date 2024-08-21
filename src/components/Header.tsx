import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/auth';
import routesConfig from '../config/routesConfig.json';
import { CgMenuGridO } from "react-icons/cg";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/');
  };
  

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const publicRoutes = routesConfig.publicRoutes;
  const role = userRole as string;
  const roleRoutes = (routesConfig.roleRoutes as { [key: string]: { path: string; element: string; name: string; viewHeader: boolean; }[] })[role];
  const combinedRoutes = [...publicRoutes, ...roleRoutes];

  return (
    <Navbar expand="lg" className="bg-transparent navbar-light" style={{ paddingBottom: '0px' }}>
      <Container fluid className="pl-4 pr-4">
        <Navbar.Brand as={Link} to="/">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            roundedCircle
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {combinedRoutes.map((route, index) => {
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
              <CgMenuGridO size={20} className="custom-icon" style={{ color: "black" }} />
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

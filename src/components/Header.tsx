import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/auth';
import routesConfig from '../config/routesConfig.json';
import { CgMenuGridO } from "react-icons/cg";
import { FaUsers, FaCircle } from "react-icons/fa"; // Icons for users and online status
import api from '../utils/axios';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);

  const [guildMemberCount, setGuildMemberCount] = useState<number | null>(null);
  const [onlineMemberCount, setOnlineMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchMemberCounts = async () => {
      try {
        const [membersResponse, onlineResponse] = await Promise.all([
          api.get(`/discord/guild/members`),
          api.get(`/discord/guild/online`),
        ]);
        setGuildMemberCount(membersResponse.data);
        setOnlineMemberCount(onlineResponse.data);
      } catch (error) {
        console.error('Error fetching member counts:', error);
      }
    };

    fetchMemberCounts();
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const publicRoutes = routesConfig.publicRoutes;
  const roleRoutes = userRole && routesConfig.roleRoutes[userRole as keyof typeof routesConfig.roleRoutes] 
    ? routesConfig.roleRoutes[userRole as keyof typeof routesConfig.roleRoutes] 
    : [];

  const combinedRoutes = [...publicRoutes, ...roleRoutes];
  
  const mainRoutes = combinedRoutes.filter(route => !route.hidden && route.viewHeader !== false);
  const dropdownRoutes = combinedRoutes.filter(route => route.hidden);

  return (
    <Navbar expand="lg" className="navbar-light" style={{ paddingBottom: '0px', backgroundColor: "#FFFFFF", borderBottom: "1px solid #E0E0E0" }}>
      <Container fluid className="pl-4 pr-4">
        <Navbar.Brand as={Link} to="/">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            roundedCircle
            style={{ width: '40px', height: '40px', objectFit: 'cover', marginInline: 10 }}
          />
          <span style={{ fontFamily: "Montaga", fontSize: "1.5rem", color: "#3E2723" }} className="ml-2">Tertulia Literaria</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {mainRoutes.map((route, index) => (
              <Nav.Link key={index} as={Link} to={route.path} className="custom-nav-link" style={{ color: "black" }}>
                <p style={{ color: "black", margin: 0 }}>{route.name}</p>
              </Nav.Link>
            ))}
            {guildMemberCount !== null && (
              <Nav.Item className="d-flex align-items-center" style={{ marginRight: 15 }}>
                <div style={circleStyle('#E0E0E0')}>
                  <FaUsers  size={14} style={{ marginRight: 5, color: "black" }} />
                  <span style={{ color: "black" }} >{guildMemberCount}</span>
                </div>
              </Nav.Item>
            )}
            {onlineMemberCount !== null && (
              <Nav.Item className="d-flex align-items-center">
                <div style={circleStyle('#4CAF50')}>
                  <FaCircle size={14} style={{ marginRight: 5, color: "black" }} />
                  <span style={{ color: "black" }}>{onlineMemberCount}</span>
                </div>
              </Nav.Item>
            )}
          </Nav>
          <Dropdown align="end">
            <Dropdown.Toggle as="span" id="dropdown-basic" className="d-flex align-items-center" style={{ cursor: 'pointer', marginInline: 10 }}>
              <CgMenuGridO size={20} className="custom-icon" style={{ color: "black" }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {dropdownRoutes.map((route, index) => (
                <Dropdown.Item key={index} as={Link} to={route.path}>
                  {route.name}
                </Dropdown.Item>
              ))}
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

const circleStyle = (backgroundColor: string) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor,
  borderRadius: '50%',
  padding: '10px',
  color: 'white',
  fontSize: '14px',
});

export default Header;

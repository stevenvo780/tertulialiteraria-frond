import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from '../views/Login';
import Register from '../views/Register';
import Events from '../views/Events';
import Publications from '../views/Publications';
import Library from '../views/Library';
import Home from '../views/Home';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const roleRoutes: { [key: string]: { path: string; element: React.FC }[] } = {
  user: [
    { path: '/', element: Home },
    { path: '/publications', element: Publications },
    { path: '/library', element: Library },
  ],
  admin: [
    { path: '/', element: Home },
    { path: '/events', element: Events },
    { path: '/publications', element: Publications },
    { path: '/library', element: Library },
  ],
};

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);

  useEffect(() => {}, [user]);

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const routesForRole = roleRoutes[user.role || 'user'];

  return (
    <Layout>
      <div style={{ margin: 10 }}>
        <Routes>
          {routesForRole.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default AuthWrapper;

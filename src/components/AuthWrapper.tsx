import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from '../views/Home';
import Events from '../views/Events';
import Normativa from '../views/Normativa';
import Library from '../views/Library';
import Login from '../views/Login';
import Register from '../views/Register';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const roleRoutes: { [key: string]: { path: string; element: React.FC }[] } = {
  user: [
    { path: '/', element: Home },
    { path: '/events', element: Events },
    { path: '/normativa', element: Normativa },
    { path: '/library', element: Library },
  ],
  admin: [
    { path: '/', element: Home },
    { path: '/events', element: Events },
    { path: '/normativa', element: Normativa },
    { path: '/library', element: Library },
  ],
};

const publicRoutes = [
  { path: '/home', element: Home },
  { path: '/library', element: Library },
  { path: '/events', element: Events },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
];

const generateRoutes = (routes: { path: string; element: React.FC }[]) => {
  return routes.map(({ path, element: Element }) => (
    <Route key={path} path={path} element={<Element />} />
  ));
};

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  const routesForRole = roleRoutes[user?.role || 'user'];

  return (
    <Layout>
      <div style={{ margin: 10 }}>
        <Routes>
          {generateRoutes([...publicRoutes, ...routesForRole])}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default AuthWrapper;

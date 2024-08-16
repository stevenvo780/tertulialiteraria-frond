import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import routesConfig from '../config/routesConfig.json';

// Importa manualmente los componentes
import Home from '../views/Home';
import Events from '../views/Events';
import Normativa from '../views/Normativa';
import Library from '../views/Library';
import Login from '../views/Login';
import Register from '../views/Register';

const componentMap: { [key: string]: React.FC } = {
  Home,
  Events,
  Normativa,
  Library,
  Login,
  Register
};

const generateRoutes = (routes: { path: string; element: string }[]) => {
  return routes.map(({ path, element }) => {
    const Component = componentMap[element];
    return <Route key={path} path={path} element={<Component />} />;
  });
};

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  const routesForRole = routesConfig.roleRoutes[user?.role || 'user'];

  return (
    <Layout>
      <div style={{ margin: 10 }}>
        <Routes>
          {generateRoutes(routesConfig.publicRoutes)}
          {generateRoutes(routesForRole)}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Layout>
  );
};

export default AuthWrapper;

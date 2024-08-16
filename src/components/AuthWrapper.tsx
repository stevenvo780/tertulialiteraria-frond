import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import routesConfig from '../config/routesConfig.json';

const loadComponent = (componentName: string) => {
  return lazy(() => import(`../views/${componentName}`));
};

const generateRoutes = (routes: { path: string; element: string }[]) => {
  return routes.map(({ path, element }) => {
    const Component = loadComponent(element);
    return <Route key={path} path={path} element={<Component />} />;
  });
};

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  const routesForRole = routesConfig.roleRoutes[user?.role || 'user'];

  return (
    <Layout>
      <div style={{ margin: 10 }}>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            {generateRoutes(routesConfig.publicRoutes)}
            {generateRoutes(routesForRole)}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </Layout>
  );
};

export default AuthWrapper;

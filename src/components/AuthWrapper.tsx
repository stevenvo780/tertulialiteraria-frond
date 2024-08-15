import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from '../views/Login';
import Register from '../views/Register';
import Events from '../views/Events';
import Publications from '../views/Publications';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AuthWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  useEffect(() => {
  }, [user]);

  return user ? (
    <Layout>
      <div style={{ margin: 10 }}>
        <Routes>
          <Route path="/home" element={<Publications />} />
          <Route path="/events" element={<Events />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Layout>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AuthWrapper;

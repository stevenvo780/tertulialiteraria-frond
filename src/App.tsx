import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import InfoAlert from './components/InfoAlert';
import useFirebaseAuth from './hooks/useFirebaseAuth';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
function App() {
  useFirebaseAuth();
  return (
    <>
      <Router>
        <AuthWrapper />
      </Router>
      <InfoAlert />
    </>
  );
}

export default App;

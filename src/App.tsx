import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import AuthWrapper from './components/AuthWrapper';
import InfoAlert from './components/InfoAlert';
import RingLoader from "react-spinners/RingLoader";
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const override: any = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};
function App() {
  const loading = useSelector((state: RootState) => state.ui.loading);
  return (
    <>
      {
        loading === true && (
          <div className="loader">
            <RingLoader
              color={'#0a827f'}
              loading={loading}
              cssOverride={override}
              size={100}
              aria-label="Cargando"
              data-testid="loader"
            />
          </div>
        )
      }
      <Router>
        <AuthWrapper />
      </Router>
      <InfoAlert />
    </>
  );
}

export default App;

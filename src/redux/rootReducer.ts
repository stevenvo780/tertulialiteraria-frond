import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import events from './events';
import ui from './ui';


const rootReducer = combineReducers({
  auth,
  events,
  ui,
});

export default rootReducer;

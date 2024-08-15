import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import events from './events';
import ui from './ui';
import publications from './publications';


const rootReducer = combineReducers({
  auth,
  events,
  ui,
  publications,
});

export default rootReducer;

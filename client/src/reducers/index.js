import { combineReducers } from 'redux';
import auth from './auth';
import errors from './error';


export default combineReducers({
  auth,
  errors
});

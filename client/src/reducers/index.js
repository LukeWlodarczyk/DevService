import { combineReducers } from 'redux';
import auth from './auth';
import errors from './error';
import profile from './profile';
import post from './post';


export default combineReducers({
  auth,
  errors,
  profile,
  post,
});

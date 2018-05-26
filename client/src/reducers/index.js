import { combineReducers } from 'redux';
import auth from './auth';
import errors from './error';
import profile from './profile';
import post from './post';
import career from './career';


export default combineReducers({
  auth,
  errors,
  profile,
  post,
  career,
});

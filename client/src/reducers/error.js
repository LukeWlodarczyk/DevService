import { GET_ERRORS } from '../constants/action-types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}

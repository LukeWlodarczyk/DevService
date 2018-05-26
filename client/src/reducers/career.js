import {
  GET_OFFER,
  ADD_OFFER,
  EDIT_OFFER,
  DELETE_OFFER,
  OFFER_LOADING,
} from '../constants/action-types';

const initialState = {
  offers: [],
  offer: {},
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OFFER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

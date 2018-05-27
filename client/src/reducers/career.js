import {
  GET_OFFER,
  GET_OFFERS,
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
        loading: true,
      };
    case GET_OFFERS:
      return {
        ...state,
        offers: action.payload,
        loading: false
      };
    case GET_OFFER:
      return {
        ...state,
        offer: action.payload,
        loading: false
      };
    case ADD_OFFER:
      return {
        ...state,
        offers: [action.payload, ...state.offers],
      };
    case DELETE_OFFER:
      return {
        ...state,
        offers: state.offers.filter(offer => offer._id !== action.payload),
      };
    default:
      return state;
  }
}

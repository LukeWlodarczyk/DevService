import axios from 'axios';
import {
  OFFER_LOADING,
  ADD_OFFER,
  DELETE_OFFER,
  GET_OFFERS,
  GET_OFFER,
  GET_ERRORS,
  CLEAR_ERRORS,
} from '../constants/action-types';

export const getOffer = (offerId) => dispatch => {
  dispatch(setOfferLoading());
  axios
    .get('/api/career/'+offerId)
    .then(res =>
      dispatch({
        type: GET_OFFER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_OFFER,
        payload: {}
      })
    );
};

export const getOffers = () => dispatch => {
  dispatch(setOfferLoading());
  axios
    .get('/api/career/all')
    .then(res =>
      dispatch({
        type: GET_OFFERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_OFFERS,
        payload: []
      })
    );
};

export const addOffer = (offerData, history) => dispatch => {
  axios
    .post('/api/career/', offerData)
    .then(res => {
      history.push('/offer/'+res.data._id);
      dispatch({
        type: ADD_OFFER,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteOffer = (offerId, history) => dispatch => {
  axios
    .delete('/api/career/'+offerId)
    .then(res => {
      history.push('/offers');
      dispatch({
        type: DELETE_OFFER,
        payload: offerId
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setOfferLoading = () => {
  return {
    type: OFFER_LOADING
  };
};

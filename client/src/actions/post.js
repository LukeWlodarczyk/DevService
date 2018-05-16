import axios from 'axios';

import {
  ADD_POST,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_POSTS,
  GET_POST,
  ADD_DISLIKE,
  ADD_LIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
  SET_BEST_COMMENT,
  POST_LOADING,
  DELETE_POST
} from '../constants/action-types'


export const addPost = (postData, history) => dispatch => {
  axios
    .post('/api/posts', postData)
    .then(res => {
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
      history.push(`/post/${res.data._id}`)
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get('/api/posts')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addLike = (postId, userId) => dispatch => {
  axios
    .post(`/api/posts/like/${postId}`)
    .then(res =>
      dispatch({
        type: ADD_LIKE,
        payload: userId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const disLike = (postId, userId) => dispatch => {
  axios
    .post(`/api/posts/dislike/${postId}`)
    .then(res =>
      dispatch({
        type: ADD_DISLIKE,
        payload: userId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res =>
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setBestComment = (postId, commentId) => dispatch => {
  axios
    .post(`/api/posts/comment/best/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: SET_BEST_COMMENT,
        payload: commentId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

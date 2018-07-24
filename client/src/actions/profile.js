import axios from 'axios';
import {
	GET_PROFILE,
	PROFILE_LOADING,
	CLEAR_CURRENT_PROFILE,
	GET_ERRORS,
	CLEAR_ERRORS,
	GET_PROFILES,
} from '../constants/action-types';
import { logoutUser } from './auth';

export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profiles/authenticated')
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(err => {
			dispatch(logoutUser());
		});
};

export const getProfileByUsername = username => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get(`/api/profiles/${username}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: err.response.data,
			})
		);
};

export const editProfile = (profileData, history) => dispatch => {
	axios
		.put('/api/profiles/authenticated', profileData)
		.then(res => history.push('/dashboard'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

export const getProfiles = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profiles')
		.then(res =>
			dispatch({
				type: GET_PROFILES,
				payload: res.data,
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILES,
				payload: [],
			})
		);
};

export const addExperience = (expData, history) => dispatch => {
	axios
		.post('/api/profiles/authenticated/experience', expData)
		.then(res => history.push('/dashboard'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

export const deleteExperience = id => dispatch => {
	axios
		.delete(`/api/profiles/authenticated/experience/${id}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

export const addEducation = (eduData, history) => dispatch => {
	axios
		.post('/api/profiles/authenticated/education', eduData)
		.then(res => history.push('/dashboard'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

export const deleteEducation = id => dispatch => {
	axios
		.delete(`/api/profiles/authenticated/education/${id}`)
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		);
};

export const deleteAccount = () => dispatch => {
	if (window.confirm('Are you sure? This operation is permanent!')) {
		axios
			.delete('/api/profiles/authenticated')
			.then(res => dispatch(logoutUser()))
			.catch(err =>
				dispatch({
					type: GET_ERRORS,
					payload: err.response.data,
				})
			);
	}
};

export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING,
	};
};

export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE,
	};
};

export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS,
	};
};

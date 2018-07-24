const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/experience');
const validateEducationInput = require('../validation/education');

const Profile = mongoose.model('profile');
const User = mongoose.model('users');

exports.getCurrentUserProfile = async (req, res) => {
	const profile = await Profile.findOne({ user: req.user.id }).populate(
		'user',
		['name', 'avatar']
	);

	if (!profile) {
		return res.status(404).json({
			error: true,
			message: 'There is no profile for authenticated user',
		});
	}
	res.json(profile);
};

exports.getAllProfiles = async (req, res) => {
	const profiles = await Profile.find().populate('user', ['name', 'avatar']);

	if (!profiles || profiles.length === 0) {
		return res
			.status(404)
			.send({ error: true, message: 'There are no profiles' });
	}
	res.json(profiles);
};

exports.getProfileByUsername = async (req, res) => {
	const profile = await Profile.findOne({
		username: req.params.username,
	}).populate('user', ['name', 'avatar', 'username']);

	if (!profile) {
		return res.status(404).json({
			error: true,
			message: 'Profile with that username does not exist',
		});
	}
	res.json(profile);
};

exports.getProfileByUserId = async (req, res) => {
	const profile = await Profile.findOne({
		user: req.params.user_id,
	}).populate('user', ['name', 'avatar']);

	if (!profile) {
		return res.status(404).send({
			error: true,
			message: 'Profile with that user id does not exist',
		});
	}

	res.json(profile);
};

exports.editUserProfile = async (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const profileFields = {};
	profileFields.user = req.user.id;

	const fields = [
		'company',
		'website',
		'location',
		'bio',
		'status',
		'githubusername',
	];

	fields.forEach(field => {
		if (req.body[field]) profileFields[field] = req.body[field];
	});

	profileFields.website &&
		!profileFields.website.includes('https://') &&
		(profileFields.website = 'https://' + profileFields.website);

	if (typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',').map(item => item.trim());
	}

	profileFields.social = {};

	const socials = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];

	socials.forEach(social => {
		if (req.body[social]) {
			if (req.body[social].includes('https://')) {
				profileFields.social[social] = req.body[social];
				return;
			}
			profileFields.social[social] = 'https://' + req.body[social];
		}
	});

	const profile = await Profile.findOneAndUpdate(
		{
			username: req.user.username,
		},
		{ $set: profileFields },
		{ new: true }
	);
	res.json(profile);
};

exports.addExperience = async (req, res) => {
	const { errors, isValid } = validateExperienceInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newExp = {
		title: req.body.title,
		company: req.body.company,
		location: req.body.location,
		from: req.body.from,
		to: req.body.to,
		current: req.body.current,
		description: req.body.description,
	};

	const profile = await Profile.findOneAndUpdate(
		{ user: req.user.id },
		{
			$push: {
				experience: { $each: [newExp], $position: 0 },
			},
		},
		{ new: true }
	);
	res.json(profile);
};

exports.addEducation = async (req, res) => {
	const { errors, isValid } = validateEducationInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newEdu = {
		school: req.body.school,
		degree: req.body.degree,
		fieldofstudy: req.body.fieldofstudy,
		from: req.body.from,
		to: req.body.to,
		current: req.body.current,
		description: req.body.description,
	};

	const profile = await Profile.findOneAndUpdate(
		{ user: req.user.id },
		{
			$push: {
				education: { $each: [newEdu], $position: 0 },
			},
		},
		{ new: true }
	);

	res.json(profile);
};

exports.deleteExperience = async (req, res) => {
	const profile = await Profile.findOneAndUpdate(
		{ user: req.user.id },
		{ $pull: { experience: { _id: req.params.exp_id } } },
		{ new: true }
	);
	res.json(profile);
};

exports.deleteEducation = async (req, res) => {
	const profile = await Profile.findOneAndUpdate(
		{ user: req.user.id },
		{ $pull: { education: { _id: req.params.edu_id } } },
		{ new: true }
	);
	res.json(profile);
};

exports.deleteUserAndProfile = async (req, res) => {
	await Promise.all([
		Profile.findOneAndRemove({ user: req.user.id }),
		User.findOneAndRemove({ _id: req.user.id }),
	]);

	res.json({ succes: true });
};

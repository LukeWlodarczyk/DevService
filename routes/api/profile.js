const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route   GET api/profile/authenticated
// @desc    Get current user profile
// @access  Private
router.get(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
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
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);

		if (!profiles || profiles.length === 0) {
			return res
				.status(404)
				.send({ error: true, message: 'There are no profiles' });
		}
		res.json(profiles);
	} catch (err) {
		res.status(400).json(err);
	}
});

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', async (req, res) => {
	try {
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
	} catch (err) {
		res.status(400).json(err);
	}
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
	try {
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
	} catch (err) {
		res.stataus(400).json(err);
	}
});

// @route   PUT api/profile
// @desc    Edit user profile
// @access  Private
router.put(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
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

		!profileFields.website.includes('https://') &&
			(profileFields.website = 'https://' + profileFields.website);

		if (typeof req.body.skills !== 'undefined') {
			profileFields.skills = req.body.skills
				.split(',')
				.map(item => item.trim());
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

		try {
			const profile = await Profile.findOneAndUpdate(
				{
					username: req.user.username,
				},
				{ $set: profileFields },
				{ new: true }
			);
			res.json(profile);
		} catch (err) {
			res.status.json(err);
		}
	}
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
	'/authenticated/experience',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
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

		try {
			const profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{
					$push: {
						experience: newExp,
					},
				},
				{ new: true }
			);
			res.json(profile);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
	'/authenticated/education',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
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

		try {
			const profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{
					$push: {
						education: newEdu,
					},
				},
				{ new: true }
			);

			res.json(profile);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
	'/authenticated/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $pull: { experience: { _id: req.params.exp_id } } },
				{ new: true }
			);
			res.json(profile);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private
router.delete(
	'/authenticated/education/:edu_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $pull: { education: { _id: req.params.edu_id } } },
				{ new: true }
			);
			res.json(profile);
		} catch (err) {
			res.status(400).json(err);
		}
	}
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			await Profile.findOneAndRemove({ user: req.user.id });
			await User.findOneAndRemove({ _id: req.user.id });

			res.json({ succes: true });
		} catch (e) {
			res.status(400).json(err);
		}
	}
);

module.exports = router;

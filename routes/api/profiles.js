const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchErrors = require('../../helpers/catchErrors');
const profile = require('../../controllers/profiles');

// @route   GET api/profile/authenticated
// @desc    Get authenticated user profile
// @access  Private
router.get(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.getCurrentUserProfile)
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/', catchErrors(profile.getAllProfiles));

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', catchErrors(profile.getProfileByUsername));

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', catchErrors(profile.getProfileByUserId));

// @route   PUT api/profile
// @desc    Edit user profile
// @access  Private
router.put(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.editUserProfile)
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
	'/authenticated/experience',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.addExperience)
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
	'/authenticated/education',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.addEducation)
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
	'/authenticated/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.deleteExperience)
);

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private
router.delete(
	'/authenticated/education/:edu_id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.deleteEducation)
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
	'/authenticated',
	passport.authenticate('jwt', { session: false }),
	catchErrors(profile.deleteUserAndProfile)
);

module.exports = router;

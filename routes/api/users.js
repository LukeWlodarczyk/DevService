const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchErrors = require('../../helpers/catchErrors');
const user = require('../../controllers/users');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', catchErrors(user.register));

// @route   POST api/users/register/send_email_verification/:id
// @desc    Send email verification
// @access  Private
router.post(
	'/register/send_email_verification/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(user.sendEmailVerification)
);

// @route   GET api/users/register/verify_email/:id/:token
// @desc    Check if token and id in url is valid
// @access  Public
router.get(
	'/register/verify_email/:id/:token',
	catchErrors(user.checkEmailVerificationUrl)
);

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', catchErrors(user.login));

// @route   POST api/users/forgot_password
// @desc    Send email with reset password link
// @access  Public
router.post('/forgot_password', catchErrors(user.sendResetPasswordEmail));

// @route   GET api/users/reset_password/:id/:token
// @desc    Check if token is valid
// @access  Public
router.get(
	'/reset_password/:id/:token',
	catchErrors(user.checkResetPasswordUrl)
);

// @route   PUT api/users/reset_password/:id/:token
// @desc    Set a new password
// @access  Public
router.put('/reset_password/:id/:token', catchErrors(user.setNewPassword));

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }, user.getCurrentUser)
);

module.exports = router;

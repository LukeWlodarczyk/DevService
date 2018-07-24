const mongoose = require('mongoose');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const Mailer = require('../services/Mailer');

const resetTemplate = require('../services/emailTemplates/resetEmail');
const verifyAccTemplate = require('../services/emailTemplates/verifyEmail');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateEmailInput = require('../validation/email');
const validatePasswordInput = require('../validation/password');

const User = mongoose.model('users');
const Profile = mongoose.model('profile');

exports.register = async (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	const emailExist = await User.findOne({ email: req.body.email });
	const usernameExist = await User.findOne({ username: req.body.username });

	if (emailExist && usernameExist) {
		errors.email = 'Email already exists';
		errors.username = 'Username already exists';
		return res.status(400).json(errors);
	}

	if (emailExist) {
		errors.email = 'Email already exists';
		return res.status(400).json(errors);
	}

	if (usernameExist) {
		errors.username = 'Username already exists';
		return res.status(400).json(errors);
	}

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const avatar = gravatar.url(req.body.email, {
		s: '200',
		r: 'pg',
		d: 'mm',
	});

	const newUser = new User({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		avatar,
	});

	const newUserProfile = new Profile({});

	const user = await newUser.save();

	newUserProfile.user = user.id;
	newUserProfile.username = req.body.username;
	await newUserProfile.save();

	const secret = keys.secretOrKey + user.id + user.date.getTime();

	const token = jwt.sign({ id: user.id }, secret);

	const emailData = {
		subject: 'Email Verification - DevService',
		recipients: [user.email],
		from_email: 'no-reply@devservice.com',
	};

	const mailer = new Mailer(
		emailData,
		verifyAccTemplate({ username: user.username, id: user.id, token })
	);
	await mailer.send();

	res.json({ success: true });
};

exports.sendEmailVerification = async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return res.status(404).json({
			error: true,
			message: 'Invalid URL (User ID not found in DB)',
		});
	}

	const secret = keys.secretOrKey + user.id + user.date.getTime();

	const token = jwt.sign({ id: user.id }, secret);

	const emailData = {
		subject: 'Email Verification - DevService',
		recipients: [user.email],
		from_email: 'no-reply@devservice.com',
	};

	const mailer = new Mailer(
		emailData,
		verifyAccTemplate({ username: user.username, id: user.id, token })
	);
	await mailer.send();

	res.json({ success: true });
};

exports.login = async (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email_or_username = req.body.email_or_username;
	const password = req.body.password;

	const emailPromise = User.findOne({ email: email_or_username });
	const usernamePromise = User.findOne({ username: email_or_username });

	const [email, username] = await Promise.all([emailPromise, usernamePromise]);

	const user = email || username;

	if (!user) {
		errors.email_or_username = 'User not found';
		return res.status(404).json(errors);
	}

	const isMatch = await user.comparePassword(password);

	if (!isMatch) {
		errors.password = 'Password incorrect';
		return res.status(404).json(errors);
	}

	const payload = {
		id: user.id,
		name: user.name,
		username: user.username,
		avatar: user.avatar,
		isVerified: user.isVerified,
	};

	const token = jwt.sign(payload, keys.secretOrKey, {
		expiresIn: 30 * 24 * 60 * 60 * 1000,
	});

	res.json({
		success: true,
		token: 'Bearer ' + token,
	});
};

exports.checkEmailVerificationUrl = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			error: true,
			message: 'Invalid URL (User ID not found in DB)',
		});
	}

	if (user.isVerified) {
		return res
			.status(400)
			.json({ error: true, message: 'Email has been verified already' });
	}

	const token = req.params.token;
	const secret = keys.secretOrKey + user.id + user.date.getTime();
	const payload = jwt.verify(token, secret);

	user.isVerified = true;
	const { id, name, username, avatar, isVerified } = await user.save();

	const loginToken = jwt.sign(
		{
			id,
			name,
			username,
			avatar,
			isVerified,
		},
		keys.secretOrKey,
		{ expiresIn: 30 * 24 * 60 * 60 * 1000 }
	);

	res.json({
		success: true,
		token: 'Bearer ' + loginToken,
	});
};

exports.sendResetPasswordEmail = async (req, res) => {
	const { errors, isValid } = validateEmailInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;

	const user = await User.findOne({ email });

	if (!user) {
		errors.email = 'No account with that email address exists';
		return res.status(404).json(errors);
	}

	const secret = keys.secretOrKey + user.password + user.date.getTime();

	const token = jwt.sign(
		{ id: user.id, expires: Date.now() + 3600000 },
		secret
	);

	const emailData = {
		subject: 'Reset password - DevService',
		recipients: [user.email],
		from_email: 'no-reply@devservice.com',
	};

	const mailer = new Mailer(emailData, resetTemplate({ id: user.id, token }));
	await mailer.send();

	res.send({ success: true });
};

exports.checkResetPasswordUrl = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			error: true,
			message: 'Invalid URL (User ID not found in DB)',
		});
	}

	const token = req.params.token;
	const secret = keys.secretOrKey + user.password + user.date.getTime();

	const payload = jwt.verify(token, secret);

	if (payload.expires < Date.now()) {
		return res.status(400).json({ error: true, message: 'Token expired' });
	}

	res.json({ success: true });
};

exports.setNewPassword = async (req, res) => {
	const { errors, isValid } = validatePasswordInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const user = await User.findById(req.params.id);

	if (!user) {
		return res
			.status(404)
			.json({ error: true, message: 'User does not exist ' });
	}

	const token = req.params.token;
	const secret = keys.secretOrKey + user.password + user.date.getTime();

	const payload = jwt.verify(token, secret);

	if (payload.expires < Date.now()) {
		return res.status(400).json({ error: true, message: 'Token expired' });
	}

	const isMatch = await user.comparePassword(req.body.password);

	if (isMatch) {
		errors.password =
			'Your new password must be different from your previous password';
		return res.status(400).json(errors);
	}

	user.password = req.body.password;
	await user.save();

	res.json({ success: true });
};

exports.getCurrentUser = (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
	});
};

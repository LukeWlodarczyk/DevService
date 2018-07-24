const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const requireEmailVerification = require('../middlewares/requireEmailVerification');

const JobOffer = mongoose.model('jobOffer');
const Mailer = require('../services/Mailer');

const validateOfferInput = require('../validation/jobOffer');
const validateApplicationInput = require('../validation/application');
const applyTemplate = require('../services/emailTemplates/applyForAJob');

exports.getAllOffers = async (req, res) => {
	const offers = await JobOffer.find()
		.sort({ date: -1 })
		.populate('user', ['name', 'avatar']);

	if (!offers || offers.length === 0) {
		return res
			.status(404)
			.json({ error: true, message: 'There are no offers' });
	}

	res.json(offers);
};

exports.getOfferById = async (req, res) => {
	const offer = await JobOffer.findById(req.params.id).populate('user', [
		'id',
		'username',
	]);

	if (!offer) {
		return res
			.status(404)
			.json({ error: true, message: 'Offer with that ID does not exist' });
	}

	res.json(offer);
};

exports.addJobOffer = async (req, res) => {
	const { errors, isValid } = validateOfferInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const jobOffer = {};
	jobOffer.user = req.user.id;

	const offerFields = [
		'company',
		'website',
		'location',
		'email',
		'phoneNumber',
		'position',
		'description',
	];

	offerFields.map(field => {
		if (req.body[field]) jobOffer[field] = req.body[field];
	});

	const arraySkills = ['requirements', 'niceToHave', 'languages', 'canOffer'];

	arraySkills.map(field => {
		if (typeof req.body[field] !== 'undefined') {
			jobOffer[field] = req.body[field].split(',').map(item => item.trim());
		}
	});

	const newOffer = await JobOffer.create(jobOffer);
	const populatedOffer = await Post.populate(newOffer, {
		path: 'user',
		select: ['id', 'username'],
	});
	res.json(populatedOffer);
};

exports.editJobOffer = async (req, res) => {
	const { errors, isValid } = validateOfferInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const jobOffer = {};
	jobOffer.user = req.user.id;

	const offerFields = [
		'company',
		'website',
		'location',
		'email',
		'phoneNumber',
		'position',
		'description',
	];

	offerFields.map(field => {
		if (req.body[field]) jobOffer[field] = req.body[field];
	});

	const arraySkills = ['requirements', 'niceToHave', 'languages', 'canOffer'];

	arraySkills.map(field => {
		if (typeof req.body[field] !== 'undefined') {
			jobOffer[field] = req.body[field].split(',').map(item => item.trim());
		}
	});

	const offer = await JobOffer.findById(req.body.id).populate('user', ['id']);

	if (!offer) {
		res
			.status(404)
			.json({ error: true, message: 'Offer with that ID does not exist' });
	}

	if (req.user.id !== offer.user._id.toString()) {
		return res.status(401).json({
			error: true,
			message: 'User not authorized. This offer belongs to different user.',
		});
	}

	const updatedOffer = await JobOffer.findByIdAndUpdate(
		req.body.id,
		{ $set: jobOffer },
		{ new: true }
	);
	const populatedOffer = await Post.populate(updatedOffer, {
		path: 'user',
		select: ['id', 'username'],
	});

	res.json(populatedOffer);
};

exports.removeOffer = async (req, res) => {
	const offer = await JobOffer.findById(req.params.id);

	if (!offer) {
		return res
			.status(404)
			.json({ error: true, message: 'Offer with that ID does not exist' });
	}

	if (req.user.id !== offer.user.toString()) {
		return res.status(401).json({
			error: true,
			message: 'User not authorized. This offer belongs to different user.',
		});
	}

	await offer.remove();

	res.json({ success: true });
};

exports.applyForAJob = async (req, res) => {
	const { errors, isValid } = validateApplicationInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const offer = await JobOffer.findById(req.params.id);

	const emailData = {
		subject: req.body.subject,
		recipients: [offer.email],
		from_email: req.body.email,
	};

	if (req.body.attachment) {
		emailData.attachment = {
			base64File: req.body.attachment.base64File,
			fileName: req.body.attachment.fileName,
		};
	}

	const mailer = new Mailer(
		emailData,
		applyTemplate({ message: req.body.message })
	);
	await mailer.send();

	res.send({ success: true });
};

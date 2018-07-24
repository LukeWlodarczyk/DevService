const express = require('express');
const router = express.Router();
const passport = require('passport');

const requireEmailVerification = require('../../middlewares/requireEmailVerification');

const catchErrors = require('../../helpers/catchErrors');
const career = require('../../controllers/career');

// @route   GET api/career/all
// @desc    Get all offers
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	catchErrors(career.getAllOffers)
);

// @route   GET api/career/:id
// @desc    Get offer by id
// @access  Private
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	catchErrors(career.getOfferById)
);

// @route   POST api/career
// @desc    Add job offer
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	requireEmailVerification,
	catchErrors(career.addJobOffer)
);

// @route   PUT api/career
// @desc    Edit job offer
// @access  Private
router.put(
	'/',
	passport.authenticate('jwt', { session: false }),
	requireEmailVerification,
	catchErrors(career.editJobOffer)
);

// @route   DELETE api/carrer/:id
// @desc    Remove offer
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	requireEmailVerification,
	catchErrors(career.removeOffer)
);

// @route   POST api/carrer/apply
// @desc    Send email to offer author
// @access  Private
router.post(
	'/:id/apply',
	passport.authenticate('jwt', { session: false }),
	requireEmailVerification,
	catchErrors(career.applyForAJob)
);

module.exports = router;

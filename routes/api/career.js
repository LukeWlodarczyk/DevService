const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const JobOffer = require('../../models/JobOffer');
const Mailer = require('../../services/Mailer');

const validateOfferInput = require('../../validation/jobOffer');
const validateApplicationInput = require('../../validation/application');
const applyTemplate = require('../../services/emailTemplates/applyForAJob');


// @route   GET api/career/all
// @desc    Get all offers
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  JobOffer
    .find()
    .sort({ date: -1 })
    .populate('user', ['name', 'avatar'])
    .then(offers => {
      if(!offers || offers.length === 0) {
        errors.nooffers = 'There are no offers';
        return res.status(404).send(errors);
      }
      res.json(offers);
    })
    .catch(err => res.status(404).json({ offers: 'There are no offers' }));
});

// @route   GET api/career/:id
// @desc    Get offer by id
// @access  Public
router.get('/:id', (req, res) => {
  JobOffer
    .findById(req.params.id)
    .populate('user', ['id', 'username'])
    .then(offer => res.json(offer))
    .catch(err => res.status(404).json({ error: true, message: "This offer doesn't exist" }));
});

// @route   POST api/career
// @desc    Add or edit job offer
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

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

  offerFields.map( field => {
    if(req.body[field]) jobOffer[field] = req.body[field];
  })

  const arraySkills = [
    'requirements',
    'niceToHave',
    'languages',
    'canOffer',
  ];

  arraySkills.map( field => {
    if(typeof req.body[field] !== 'undefined') {
      jobOffer[field] = req.body[field]
       .split(",")
       .map(item => item.trim());
    }
  })

  if(req.body.id) {
    JobOffer
      .findById(req.body.id)
      .populate('user', ['id'])
      .then(offer => {
        if(req.user.id !== offer.user._id.toString()) {
           return res.status(401).json({ notauthorized: "User not authorized" });
        };

        JobOffer
          .findByIdAndUpdate(req.body.id, { $set: jobOffer }, { new: true })
          .then(offer => res.json(offer))
          .catch(err => res.json(err));
      })
      return;
  }

  JobOffer
    .create(jobOffer)
    .then(offer => res.json(offer))
    .catch(err => res.json(err))

});

// @route   DELETE api/carrer/:id
// @desc    Remove offer
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    JobOffer
      .findById(req.params.id)
      .then(offer => {
        if(!offer) {
          return res.status(404).json({ offernotexists: 'Offer does not exist' });
        };

        if(req.user.id !== offer.user.toString()) {
           return res.status(401).json({ notauthorized: "User not authorized" });
        };

        offer
          .remove()
          .then( () => res.json({ success: true }))
          .catch(err => res.json(err));
      })
      .catch(err => res.status(404).json({ offernotfound: 'No offer found' }));
  }
);

// @route   POST api/carrer/apply
// @desc    Send email to offer author
// @access  Private
router.post('/:id/apply', passport.authenticate('jwt', { session: false }), async (req, res) => {

  const { errors, isValid } = validateApplicationInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const offer = await JobOffer.findById(req.params.id);

  const emailData = {
    subject: req.body.subject,
    recipients: [offer.email],
    from_email: req.body.email,
  }

  try {
    const mailer = new Mailer(emailData, applyTemplate({ message: req.body.message }));
    await mailer.send();

    res.send({ success: true });

  } catch (e) {
    errors.email = 'Sorry, something went wrong. Try agin later.';
    return res.status(400).json(errors);
  }

  }
);

module.exports = router;

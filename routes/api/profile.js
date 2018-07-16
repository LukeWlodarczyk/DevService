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

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile
    .find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles || profiles.length === 0) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).send(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/:username
// @desc    Get profile by username
// @access  Public
router.get('/:username', (req, res) => {
  const errors = {};
  Profile
    .findOne({ username: req.params.username })
    .populate('user', ['name', 'avatar', 'username'])
    .then(profile => {
      if(!profile) {
        return res.status(404).json({ error: true, message: "This user doesn't exist" })
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err))
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).send(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @route   POST api/profile
// @desc    Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills
     .split(",")
     .map(item => item.trim());
  }

  profileFields.social = {};

	const socials = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];

	socials.forEach( social => {
		if(req.body[social]) {
			if(req.body[social].includes('https://')) {
				profileFields.social[social] = req.body[social];
				return;
			}
			profileFields.social[social] = 'https://' + req.body[social];
		}
	})



  Profile
    .findOne({ username: req.user.username })
    .then(profile => {
      profile
        .update({ $set: profileFields }, { new: true })
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch( err => res.json(err));

});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.experience.unshift(newExp);

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.education.unshift(newEdu);

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {

      profile.experience.remove({ _id: req.params.exp_id });

      profile
        .save()
        .then(result => res.json(profile))
        .catch(err => res.json(err));

    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {

      profile.education.remove({ _id: req.params.edu_id });

      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOneAndRemove({ user: req.user.id })
    .then(profile => {
      User
        .findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ succes: true }))
        .catch(err => res.status(404).json(err));

    })
    .catch(err => res.status(404).json(err));
});



module.exports = router;

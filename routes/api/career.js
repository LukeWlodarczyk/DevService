const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');



// @route   POST api/career
// @desc    Add job offer
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateOfferInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const jobOffer = {};
  jobOffer.user = req.user.id;
  if (req.body.company) jobOffer.company = req.body.company;
  if (req.body.website) jobOffer.website = req.body.website;
  if (req.body.location) jobOffer.location = req.body.location;
  if (req.body.email) jobOffer.email = req.body.email;
  if (req.body.phoneNumber) jobOffer.phoneNumber = req.body.phoneNumber;
  if (req.body.position) jobOffer.position = req.body.position;
  if (req.body.requirements) jobOffer.requirements = req.body.requirements;
  if (req.body.niceToHave) jobOffer.niceToHave = req.body.niceToHave;
  if (req.body.description) jobOffer.description = req.body.description;
  if (req.body.languages) jobOffer.languages = req.body.languages;
  if (req.body.canOffer) jobOffer.canOffer = req.body.canOffer;

  if (typeof req.body.skills !== 'undefined') {
    jobOffer.skills = req.body.skills
     .split(",")
     .map(item => item.trim());
  }


  JobOffer
    .findById(req.params.id)
    .then( offer => {
      offer
        .update({ $set: jobOffer }, { new: true })
        .then(profile => res.json(offer))
        .catch(err => res.json(err));
    })
    .catch( err => res.json(err));

});


module.exports = router;

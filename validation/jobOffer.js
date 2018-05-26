const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateOfferInput = data => {
  const errors = {};

  data.position = !isEmpty(data.position) ? data.position : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.requirements = !isEmpty(data.requirements) ? data.requirements : '';
  data.canOffer = !isEmpty(data.canOffer) ? data.canOffer : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.languages = !isEmpty(data.languages) ? data.languages : '';

  if (Validator.isEmpty(data.position)) {
    errors.position = 'Position field is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  if (Validator.isEmail(data.email)) {
    errors.email = 'Email is not valid';
  }

  if (Validator.isEmpty(data.location)) {
    errors.location = 'Location field is required';
  }

  if (Validator.isEmpty(data.requirements)) {
    errors.requirements = 'Requirements field is required';
  }

  if (Validator.isEmpty(data.canOffer)) {
    errors.canOffer = 'Benefits field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  if (Validator.isEmpty(data.languages)) {
    errors.languages = 'Languages field is required';
  }

  const siteUrls = [
    'website',
  ]

  siteUrls.forEach(field => {
    if (!isEmpty(data[field])) {
      if (!Validator.isURL(data[field])) {
        errors[field] = 'Not a valid URL';
      };
    };
  })

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateOfferInput;

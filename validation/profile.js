const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateProfileInput = data => {
  const errors = {};

  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  const siteUrls = [
    'website',
    'youtube',
    'twitter',
    'facebook',
    'linkedin',
    'instagram',
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

module.exports = validateProfileInput;

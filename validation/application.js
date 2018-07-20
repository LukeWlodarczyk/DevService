const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginInput = data => {
  const errors = {};

  data.message = !isEmpty(data.message) ? data.message : '';
  data.subject = !isEmpty(data.subject) ? data.subject : '';
  data.email = !isEmpty(data.email) ? data.email : '';


  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Field is required';
  }

  if (!Validator.isLength(data.subject, { min: 5 })) {
    errors.subject = 'Subject is too short (min: 5 characters)';
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = 'Subject field is required';
  }

  if (!Validator.isLength(data.message, { min: 20 })) {
    errors.message = 'Message is too short (min: 20 characters)';
  }

  if (Validator.isEmpty(data.message)) {
    errors.message = 'Message field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;

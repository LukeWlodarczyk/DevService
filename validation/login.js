const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginInput = data => {
  const errors = {};

  data.email_or_username = !isEmpty(data.email_or_username) ? data.email_or_username : '';
  data.password = !isEmpty(data.password) ? data.password : '';


  if (Validator.isEmpty(data.email_or_username)) {
    errors.email_or_username = 'Field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;

const Validator = require('validator');
const isEmpty = require('./is-empty');

const validatePostInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.title, { min: 10, max: 30 })) {
    errors.title = 'Title must be between 10 and 30 characters';
  }

  if (!Validator.isLength(data.text, { min: 20, max: 300 })) {
    errors.text = 'Post must be between 20 and 300 characters';
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validatePostInput;

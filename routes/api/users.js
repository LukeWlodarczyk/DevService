const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtS= require('jwt-simple');
const keys = require('../../config/keys');
const passport = require('passport');
const Mailer = require('../../services/Mailer');
const resetTemplate = require('../../services/emailTemplates/resetEmail');
const verifyAccTemplate = require('../../services/emailTemplates/verifyEmail');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateEmailInput = require('../../validation/email');
const validatePasswordInput = require('../../validation/password');

const User = require('../../models/User');
const Profile = require('../../models/Profile');


// @route   GET api/users/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors)
  }

  try {
    const emailExist = await User.findOne({ email: req.body.email });
    const usernameExist = await User.findOne({ username: req.body.username });

    if (emailExist && usernameExist) {
      errors.email = 'Email already exists';
      errors.username = 'Username already exists';
      return res.status(400).json(errors);
    }

    if (emailExist) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    }

    if (usernameExist) {
      errors.username = 'Username already exists';
      return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar,
    });

    const newUserProfile = new Profile({});

    const hash = await bcrypt.hash(newUser.password, 10);

    newUser.password = hash;

    const user = await newUser.save();

    newUserProfile.user = user.id;
    newUserProfile.username = req.body.username;
    await newUserProfile.save();

    res.json(user);

  } catch (err) {
    res.status(400).json(err)
  };

});

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email_or_username = req.body.email_or_username;
  const password = req.body.password;

  User
    .findOne({$or:[{email:{$regex: email_or_username, $options: 'i'}},
                  {username:{$regex: email_or_username, $options: 'i'}}]
    })
    .then(user => {
      if (!user) {
        errors.email_or_username = 'User not found';
        return res.status(404).json(errors);
      };
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {

            const payload = {
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            }

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 30 * 24 * 60 * 60 * 1000 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                })
              }
            )
          } else {
            errors.password = 'Password incorrect';
            return res.status(404).json(errors)
          }
        })
    })
})

// @route   POST api/users/forgot_password
// @desc    Send email with reset password link
// @access  Public
router.post('/forgot_password', (req, res) => {

  const { errors, isValid } = validateEmailInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;

  User
    .findOne({ email })
    .then(async user => {
      if(!user) {
        errors.email = 'No account with that email address exists';
        return res.status(404).json(errors);
      }

      const secret = keys.secretOrKey + user.password + user.date.getTime();

      const token = jwtS.encode({ id: user.id, expires: Date.now() + 1800000 }, secret)

      const emailData = {
        subject: 'Reset password - DevService',
        recipients: [user.email],
        from_email: 'no-reply@devservice.com'
      }

      try {
        const mailer = new Mailer(emailData, resetTemplate({ id: user.id, token }));
        await mailer.send();

        res.send({ success: true });

      } catch (e) {
        errors.email = 'Sorry, something went wrong. Try agin later.';
        return res.status(400).json(errors);
      }


    })
    .catch(err => res.status(400).send(err));
})

// @route   GET api/users/reset_password/:id/:token
// @desc    Check if token is valid
// @access  Public
router.get('/reset_password/:id/:token', (req, res) => {

  User
    .findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: true, message: 'Invalid URL (User ID not found in DB)' })
      }

      const token = req.params.token;

      const secret = keys.secretOrKey + user.password + user.date.getTime();

      try {
        const payload = jwtS.decode(token, secret);

        if (payload.expires < Date.now()) {
          return res.status(400).json({ error: true, message: 'Token expired' })
        }

        res.json({ success: true })

      } catch (e) {
        res.status(400).json({ error: true, message: 'Invalid token' })
      }

    })
    .catch(err => res.status(404).json({ error: true, message: 'User does not exist' }));
})

// @route   POST api/users/reset_password/:id/:token
// @desc    Set a new password
// @access  Public
router.post('/reset_password/:id/:token', (req, res) => {

  const { errors, isValid } = validatePasswordInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  User
    .findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: true, message: 'User does not exist ' })
      }

      const token = req.params.token;

      const secret = keys.secretOrKey + user.password + user.date.getTime();

      try {
        const payload = jwtS.decode(token, secret);

        if (payload.expires < Date.now()) {
          return res.status(400).json({ error: true, message: 'Token expired.' })
        }

        const newPassword = req.body.password;

        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) return res.status(400).json(err);
          user.password = hash;
          user.save();
        });

        res.json({ success: true })

      } catch (e) {
        res.status(400).json({ error: true, message: 'Invalid token' })
      }

    })
    .catch(err => res.status(404).json({ error: true, message: 'User does not exist' }));
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  })
});


module.exports = router;

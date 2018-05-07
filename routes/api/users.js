const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');


const User = require('../../models/User');


// @route   GET api/users/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists'});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    };
  });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).send({ email: 'User not found!' })
      };
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {

            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            }

            jwt.sign(
              payload,
              keys.secretKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                })
              }
            )
          } else {
            return res.status(404).json({ password: 'Password incorrect' })
          }
        })
    })
})

module.exports = router;

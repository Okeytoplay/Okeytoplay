const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const { checkFields } = require('../middlewares/auth');

const router = express.Router();

const bcryptSalt = 10; // bcrypt.

/* GET SignUp page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* POST from SignUp */
router.post('/signup', checkFields, async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      req.flash('error', `Sorry, this ${email} has an account on the site!!`);
      res.redirect('/signup');
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ username, email, password: hashedPassword });
    req.session.currentUser = newUser;
    req.flash('success', `${username}, your account has been created.`);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

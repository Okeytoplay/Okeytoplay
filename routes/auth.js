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
      console.log('USUARIO EXISTE');
      res.redirect('/auth/signup');
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ username, email, hashedPassword });
    req.session.currentUser = newUser;
    req.flash('success', `${username}, your account has been created.`);
    // res.redirect('/profile');  //Aquí tenemos que redirigir cuando tengamos la routa y la vista
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});


module.exports = router;

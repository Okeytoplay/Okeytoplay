const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const { checkFields, checkEmailAndPasswordNotEmpty, checkIfLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile-create', checkIfLoggedIn, (req, res, next) => {
  res.render('user/profile-create');
});

router.post('/profile', checkIfLoggedIn, async (req, res, next) => {
  const {
    role1,
    role2,
    role3,
    telephone,
    bandName,
    establishmentName,
  } = req.body;
  // const userID = res.locals.currentUser._id;
  try {
    const actualUserEmail = req.session.currentUser.email;
    const userFound = await User.findOne({ email: actualUserEmail });
    // if (userFound) {
    //   req.flash('error', `Sorry, this ${email} has an account on the site!!`);
    //   console.log('USUARIO EXISTE');
    //   res.redirect('/auth/signup');
    // }
    console.log(actualUserEmail, userFound);
    const updatedUser = await User.updateOne({ _id: userFound._id },
      { $set: { telephone, bandName, establishmentName } }, { new: true });
    // req.session.currentUser = newUser;
    req.flash('success', `${updatedUser.username}, your account has been updated.`);
    res.redirect('/user/profile');
    // res.redirect('/user/profile', { updatedUser }); // Aquí tenemos que redirigir cuando tengamos la ruta
    // res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  const userFound = await User.findOne({ email: actualUserEmail });
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    res.render('user/profile', userFound);
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

module.exports = router;

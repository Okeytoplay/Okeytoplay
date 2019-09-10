const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const { checkFields, checkEmailAndPasswordNotEmpty, checkIfLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile-create', checkIfLoggedIn, (req, res, next) => {
  res.render('user/profile-create');
});

module.exports = router;

const bcrypt = require('bcrypt');
const User = require('../models/User');

const checkFields = (req, res, next) => {
  const { username, email, password } = req.body;

  if (username === '' || email === '' || password === '') {
    req.flash('error', 'Sorry: Username, Email or password are empty.!!');
    res.redirect('auth/signup');
  } else {
    next();
  }
};

module.exports = {
  checkFields,
};

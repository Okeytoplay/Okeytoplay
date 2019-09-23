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

const notifications = () => (req, res, next) => {
  // We extract the messages separately cause we call req.flash() we'll clean the object flash.
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};

const checkEmailAndPasswordNotEmpty = (req, res, next) => {
  const { email, password } = req.body;

  if (email !== '' && password !== '') {
    res.locals.auth = req.body;
    next();
  } else {
    req.flash('error', 'campos no pueden estar vacios');
    res.redirect('auth/signup');
  }
};

const checkIfLoggedIn = (req, res, next) => {
  console.log('Req Session antes borrar: ', req.session);
  delete req.session.returnTo;
  console.log('Req Session despues borrar: ', req.session);
  console.log('Session Current User: ', req.session.currentUser);
  if (req.session.currentUser) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    console.log('Direccion original: ', req.session.returnTo);
    res.redirect('/auth/login');
  }
};

module.exports = {
  checkFields, notifications, checkEmailAndPasswordNotEmpty, checkIfLoggedIn,
};

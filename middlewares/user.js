const User = require('../models/User');

const checkIfEstablishment = async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  const userFound = await User.findOne({ email: actualUserEmail });
  console.log(userFound.role.establishment);
  try {
    if (userFound.role.establishment) {
      next();
    } else {
      req.flash('warning', 'You don`t have any establishment and can`t manage Events!');
      res.redirect('/user');
    }
  } catch (error) {
    next(error);
  }
};

const checkIfBand = async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  const userFound = await User.findOne({ email: actualUserEmail });
  console.log(userFound.role.band);
  try {
    if (userFound.role.band) {
      next();
    } else {
      req.flash('warning', 'You are not a BAND and can not join Events to PLAY!');
      res.redirect('/user');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIfEstablishment, checkIfBand,
};

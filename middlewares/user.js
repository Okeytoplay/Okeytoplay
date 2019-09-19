const User = require('../models/User');

const checkIfEstablishment = async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  const userFound = await User.findOne({ email: actualUserEmail });
  try {
    if (userFound.role.establishment) {
      next();
    } else {
      req.flash('warning', 'No tienes un Local y no puedes crear ningún evento');
      res.redirect('/user/profile');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIfEstablishment,
};

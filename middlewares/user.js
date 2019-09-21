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
      res.redirect('/user/profile');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIfEstablishment,
};

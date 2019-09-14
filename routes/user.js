const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const Band = require('../models/Band'); // Band Model
const {
  checkFields,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares/auth');

const router = express.Router();

router.get('/profile-create', checkIfLoggedIn, (req, res, next) => {
  res.render('user/profile-create');
});

// router.post('/profile', checkIfLoggedIn, async (req, res, next) => {
//   let role = ['Groupie'];
//   const {
//     role1,
//     role2, // True si tiene Banda
//     role3,
//     telephone,
//     bandName,
//     genre,
//     description,
//     website,
//     instagram,
//     facebook,
//     member,
//     establishmentName,
//   } = req.body;
//   // const userID = res.locals.currentUser._id;
//   try {
//     let newBand;
//     let updatedUser;
//     const actualUserEmail = req.session.currentUser.email;
//     const userFound = await User.findOne({ email: actualUserEmail });
//     // if (userFound) {
//     //   req.flash('error', `Sorry, this ${email} has an account on the site!!`);
//     //   console.log('USUARIO EXISTE');
//     //   res.redirect('/auth/signup');
//     // }
//     console.log(actualUserEmail, userFound);
//     console.log('Role 2:', role2);
//     if (role2 === 'Band') {
//       role.push('Band');
//       newBand = await Band.create({
//         name: bandName,
//         genre,
//         description,
//         website,
//         instagramProfile: instagram,
//         facebookProfile: facebook,
//         bandMembers1: member,
//       });
//       req.flash('success', `${bandName} has been created.`);
//       console.log('Banda Creada;', newBand);
//       updatedUser = await User.updateOne({ _id: userFound._id },
//         {
//           $set: {
//             telephone, bandName, establishmentName, 'role.band': true, band: newBand,
//           },
//         }, { new: true });
//     }
//     // Ahora solo Actualiza si se introcuen datos de BANDA
//     // const updatedUser = await User.updateOne({ _id: userFound._id },
//     //   {
//     //     $set: {
//     //       telephone, bandName, establishmentName, 'role.band': true,
//     //     },
//     //   }, { new: true });
//     // req.session.currentUser = newUser;
//     // req.flash('success', `${updatedUser.username}, your account has been updated.`);
//     res.redirect('/user/profile');
//     // res.redirect('/user/profile', { updatedUser }); // Aquí tenemos que redirigir cuando tengamos la ruta
//     // res.redirect('/');
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band',
  );
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    const role = ['Groupie'];
    if (userFound.role.band) {
      role.push('Band');
    }
    if (userFound.role.establisment) {
      role.push('Establishment');
    }
    // res.render('user/profile', userFound, role);
    res.render('user/profile', { userFound, role });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band',
  );
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    const role = ['Groupie'];
    if (userFound.role.band) {
      role.push('Band');
    }
    if (userFound.role.establisment) {
      role.push('Establishment');
    }
    // res.render('user/profile', userFound, role);
    res.render('user/profile', { userFound, role });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

module.exports = router;

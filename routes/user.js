const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const Band = require('../models/Band'); // Band Model
const Event = require('../models/Event'); // Event Model
const Establishment = require('../models/Establishment'); // Band Model

const {
  checkFields,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares/auth');
const { checkIfEstablishment } = require('../middlewares/user.js');
const { fechaDeHoy } = require('../public/javascripts/fecha');

const router = express.Router();

router.post('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band establishment',
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
    'band establishment',
  );
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    res.render('user/profile', { userFound });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

/* GET Renders available events of the user-> Show all the events of the user */
router.get('/events', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'establishment',
  );
  console.log('UserFound', userFound);
  if (userFound.role.establishment === false) {
    req.flash('error', 'No se ha encontrado que tengas ningún Local');
    res.redirect('/profile');
  } else {
    const userEstablishmentID = userFound.establishment._id;
    const fechaActual = await fechaDeHoy();
    const events = await Event.find({
      establishment: userEstablishmentID,
    }).sort('schedule');
    console.log('EVENTOS ORDENADOS por fecha del ESTABLISHMENT: ', events);
    try {
      console.log('FECHA ', fechaActual);
      console.log('events ', events);
      res.render('user/events', { events, fechaActual, userFound });
    } catch (error) {
      next(error);
    }
  }
});

/* GET Renders new event -> Show the page to create a new event */
router.get(
  '/events/new',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const fechaActual = await fechaDeHoy();
    try {
      res.render('user/events/new', { fechaActual });
    } catch (error) {
      next(error);
    }
  },
);

/* POST Create NEW EVENT */

router.post(
  '/events/new',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const { name, description, price, durationMins, schedule } = req.body;
    const actualUserEmail = req.session.currentUser.email;
    // const userFound = await User.findOne({ email: actualUserEmail }).populate(
    //   'establishment',
    // ); // THIS IS THE CORRECT!!!
    // ONLY FOR TEST
    // ONLY FOR TEST Allow to insert Event without ESTABLISHMENT
    const userFound = await User.findOne({ email: actualUserEmail });

    try {
      const eventNew = await Event.create({
        name,
        description,
        price,
        durationMins,
        schedule,
        establishmentId: userFound.establishment,
      });
      // Poner FLASH notification
      req.flash('success', ` El evento ${name} ha sido creado con exito`);
      res.redirect('/user/events'); // A donde vamos?
    } catch (error) {
      next(error);
    }
  },
);
module.exports = router;
// router.get('/profile-create', checkIfLoggedIn, (req, res, next) => {
//   res.render('user/profile-create');
// });

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

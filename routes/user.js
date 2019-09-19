const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const Band = require('../models/Band'); // Band Model
const Event = require('../models/Event'); // Event Model
const Establishment = require('../models/Establishment'); // Band Model
const { checkIfEstablishment } = require('../middlewares/user.js');
const { fechaDeHoy } = require('../public/javascripts/fecha');
const {
  checkFields,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares/auth');

const router = express.Router();

router.post('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserId = req.session.currentUser._id;
  // console.log(actualUserEmail);
  try {
    const userFound = await User.findById(actualUserId).populate(
      'band establishment',
    );
    // const userID = userFound._id;
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
    res.render('user', { userFound, role });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserId = req.session.currentUser._id;
  // console.log(actualUserEmail);
  try {
    const userFound = await User.findById(actualUserId).populate('band establishment');
    // const userID = userFound._id;
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('user', { userFound });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserId = req.session.currentUser._id;
  // console.log(actualUserEmail);
  try {
    const user = await User.findById(actualUserId).populate('band establishment');
    // const userID = userFound._id;
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('user/profile', { user });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

// GETS the user profile landing page, where he can edit his information
router.get('/profile/edit-user', checkIfLoggedIn, async (req, res, next) => {
  const userID = req.session.currentUser._id;

  try {
    const user = await User.findById(userID);
    res.render('user/profile/edit-user', { user });
  } catch (error) {
    next(error);
  }
});

// POST submits profile edit form
router.post('/profile/edit-user', checkIfLoggedIn, async (req, res, next) => {
  const { username, email } = req.body;
  // const actualUserEmail = req.session.currentUser.email;
  const userID = req.session.currentUser._id;
  // console.log('userId:', userID);
  if (username === '' || email === '') {
    req.flash('error', 'No empty fields allowed.');
    res.redirect('/profile/edit-user');
  }

  try {
    const userModifiedData = await User.findByIdAndUpdate(
      userID,
      { username, email },
      { new: true },
    );
    req.session.currentUser = userModifiedData;
    req.flash('success', `User ${username} succesfully updated.`);
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// GETS the band profile landing page, where he can edit his information
router.get('/profile/edit-band', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser._id;
  try {
    const userBandId = await User.findById(user);
    const userBand = await Band.findById(userBandId.band);

    res.render('user/profile/edit-band', { userBand });
  } catch (error) {
    next(error);
  }
});

// POST submits profile band edit form
router.post('/profile/edit-band', checkIfLoggedIn, async (req, res, next) => {
  const {
    name,
    genre,
    description,
    website,
    instagramProfile,
    facebookProfile,
    avatar,
  } = req.body;
  // const actualUserEmail = req.session.currentUser.email;
  const userID = req.session.currentUser._id;
  // console.log('userIdPost:', userID);
  try {
    const userBand = await User.findById(userID);
    // console.log('userBandPost:', userBand);

    if (name === '') {
      req.flash('error', 'No empty fields allowed.');
      res.redirect('/profile/edit-band');
    }

    const bandModifiedData = await Band.findByIdAndUpdate(
      userBand.band,
      {
        name,
        genre,
        description,
        website,
        instagramProfile,
        facebookProfile,
        avatar,
      },
      { new: true },
    );
    console.log('bandModifiedData:', bandModifiedData);
    req.flash('success', 'Band succesfully updated.');
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// Delete user band
router.get('/profile/delete-band', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userBandId = await User.findById(user);
    const bandId = userBandId.band;

    const bandDelete = await Band.findByIdAndDelete(bandId);
    await User.updateOne({ _id: user }, { $unset: { band: 1 }, 'role.band': false });
    req.flash('info', 'Banda eliminada correctamente');
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// GETS the establishment profile landing page, where he can edit his information
router.get('/profile/edit-establishment', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser._id;
  try {
    // const band = await Band.findById(userID);
    const userEstablishmentId = await User.findById(user);
    console.log(
      'kepasauserEstablishmentId: ',
      userEstablishmentId.establishment,
    );
    const userEstablishment = await Establishment.findById(
      userEstablishmentId.establishment,
    );
    console.log('kepasauserEstablishment: ', userEstablishment);

    res.render('user/profile/edit-establishment', { userEstablishment });
  } catch (error) {
    next(error);
  }
});

// POST submits profile establishment edit form
router.post(
  '/profile/edit-establishment',
  checkIfLoggedIn,
  async (req, res, next) => {
    const {
      name,
      description,
      website,
      instagramProfile,
      facebookProfile,
      street,
      city,
      zip,
      capacity,
      avatar,
    } = req.body;
    // const actualUserEmail = req.session.currentUser.email;
    const userID = req.session.currentUser._id;
    console.log('userIdPost:', userID);
    try {
      const userEstablishment = await User.findById(userID);
      console.log('userEstablishmentPost:', userEstablishment);

      if (name === '') {
        req.flash('error', 'No empty fields allowed.');
        res.redirect('/profile/edit-band');
      }

      const establishmentModifiedData = await Establishment.findByIdAndUpdate(
        userEstablishment.establishment,
        {
          name,
          description,
          website,
          instagramProfile,
          facebookProfile,
          street,
          city,
          zip,
          capacity,
          avatar,
        },
        { new: true },
      );
      console.log('establishmentModifiedData:', establishmentModifiedData);
      req.flash('success', 'Establishment succesfully updated.');
      res.redirect('/user');
    } catch (error) {
      next(error);
    }
  },
);

// Delete user establishment
router.get('/profile/delete-establishment', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userId = await User.findById(user);
    const establishmentId = userId.establishment;

    const establishmentDelete = await Establishment.findByIdAndDelete(
      establishmentId,
    );
    // console.log('El user antes de actualizar:', userId);
    // Update the User info
    await User.updateOne({ _id: userId }, { $unset: { establishment: 1 }, 'role.establishment': false });
    // If the user delete the ESTABLISHMENT, The EVENTS OF THIS ESTABLISHMENTS HAS TO BE DELETED
    const responseDeletedEvents = await Event.deleteMany({ establishment: establishmentId });
    // const userIdAct = await User.findById(user);
    // console.log('El user antes de actualizar:', userIdAct);
    req.flash('info', 'Establishment and his Events succesfully deleted.');
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

/* GET Renders available events of the user-> Show all the events of the user */
router.get('/events', checkIfLoggedIn, async (req, res, next) => {
  try {
    if (req.session.currentUser.role.establishment === false) {
      req.flash('error', 'Seems you don`t have any Establishment, First, Create one!!');
      // res.redirect('/profile');
      res.redirect('/');
    } else {
      const userFound = await User.findById(req.session.currentUser._id).populate('establishment');
      const fechaActual = fechaDeHoy();
      const events = await Event.find({ establishment: userFound.establishment._id })
        .sort('schedule')
        .populate('registeredUsers');
      if (events.length > 0) {
        res.render('user/events', { events, fechaActual, userFound });
      } else {
        req.flash('info', 'You don`t have events in your establishment yet.');
        res.redirect('/');
      }
    }
  } catch (error) {
    next(error);
  }
});

/* GET Renders new event -> Show the page to create a new event */
router.get('/events/new', checkIfLoggedIn, checkIfEstablishment, async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    res.render('user/events/new', { fechaActual });
  } catch (error) {
    next(error);
  }
});

/* POST Create NEW EVENT */

router.post('/events/new', checkIfLoggedIn, checkIfEstablishment, async (req, res, next) => {
  const { name, description, price, durationMins, schedule } = req.body;
  const actualUserId = req.session.currentUser._id;
  // const userFound = await User.findOne({ email: actualUserEmail }).populate(
  //   'establishment',
  // ); // THIS IS THE CORRECT!!!
  // ONLY FOR TEST
  // ONLY FOR TEST Allow to insert Event without ESTABLISHMENT
  try {
    const userFound = await User.findById(actualUserId);

    const eventNew = await Event.create({
      name,
      description,
      price,
      durationMins,
      schedule,
      establishment: userFound.establishment,
    });
    // Poner FLASH notification
    req.flash('success', ` The event ${name} has been created successfully!!`);
    res.redirect('/user/events'); // A donde vamos?
  } catch (error) {
    next(error);
  }
});

router.get('/events/bookings', checkIfLoggedIn, checkIfEstablishment, async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual.split('/').reverse().join('/');
    const actualUserId = req.session.currentUser._id;
    const userFound = await User.findById(actualUserId).populate(
      'establishment',
    );
    console.log('UserFound', userFound);
    if (userFound.role.establishment === false) {
      req.flash('error', 'Sorry, seems your are not a Establishment owner, FIRST CREATE ONE!!');
      // res.redirect('/profile');
      res.redirect('/user/events');
    } else {
      const userEstablishmentID = userFound.establishment._id;
      const events = await Event.find({ establishment: userEstablishmentID, band: { $exists: false } }).sort('schedule');
      console.log('EVENTOS ORDENADOS por fecha del ESTABLISHMENT: ', events);
      console.log('FECHA ', fechaActual);
      console.log('events ', events);
      res.render('user/events/bookings', { events, fecha, userFound });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/events/bookedevents', checkIfLoggedIn, checkIfEstablishment, async (req, res, next) => {
  const fechaActual = fechaDeHoy();
  const fecha = fechaActual.split('/').reverse().join('/');
  const actualUserId = req.session.currentUser._id;

  try {
    const userFound = await User.findById(actualUserId).populate('establishment');
    console.log('UserFound', userFound);
    if (userFound.role.establishment === false) {
      req.flash('error', 'Sorry, seems your are not a Establishment owner, FIRST CREATE ONE!!');
      // res.redirect('/profile');
      res.redirect('/user/events');
    } else {
      const userEstablishmentID = userFound.establishment._id;
      const events = await Event.find({ establishment: userEstablishmentID, band: { $exists: true } }).sort('schedule');
      console.log('EVENTOS ORDENADOS por fecha del ESTABLISHMENT: ', events);
      console.log('FECHA ', fechaActual);
      console.log('events ', events);
      res.render('user/events/bookedevents', { events, fecha, userFound });
    }
  } catch (error) {
    next(error);
  }
});

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

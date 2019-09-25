const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const Band = require('../models/Band'); // Band Model
const Event = require('../models/Event'); // Event Model
const Establishment = require('../models/Establishment'); // Band Model
const formidable = require('formidable');

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
  const fechaActual = fechaDeHoy();
  const fecha = fechaActual.split('-').reverse().join('/');
  console.log('Fecha: ', fecha);
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
    res.render('user', { userFound, role, fecha });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserId = req.session.currentUser._id;
  const fechaActual = fechaDeHoy();
  const fecha = fechaActual.split('-').reverse().join('/');
  // console.log('Fecha: ', fecha);
  // console.log(actualUserEmail);
  try {
    const userFound = await User.findById(actualUserId).populate(
      'band establishment',
    );
    // const userID = userFound._id;
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('user', { userFound, fecha });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const actualUserId = req.session.currentUser._id;
  // console.log(actualUserEmail);
  try {
    const user = await User.findById(actualUserId).populate(
      'band establishment',
    );
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
    // After Deleting the Band, update USER INFO
    await User.updateOne(
      { _id: user },
      { $unset: { band: 1 }, 'role.band': false },
    );
    // After deleting Band, Update EVENTS with the BAND JOINED to the EVENT
    const responseDeletedEvents = await Event.updateMany(
      { band: bandId },
      { $unset: { band: 1 } },
      { multi: true },
    );
    req.flash('info', 'Banda eliminada correctamente');
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// GETS the establishment profile landing page, where he can edit his information
router.get(
  '/profile/edit-establishment',
  checkIfLoggedIn,
  async (req, res, next) => {
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
  },
);

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
router.get(
  '/profile/delete-establishment',
  checkIfLoggedIn,
  async (req, res, next) => {
    const user = req.session.currentUser;
    try {
      const userId = await User.findById(user);
      const establishmentId = userId.establishment;

      const establishmentDelete = await Establishment.findByIdAndDelete(
        establishmentId,
      );
      // console.log('El user antes de actualizar:', userId);
      // Update the User info
      await User.updateOne(
        { _id: userId },
        { $unset: { establishment: 1 }, 'role.establishment': false },
      );
      // If the user delete the ESTABLISHMENT, The EVENTS OF THIS ESTABLISHMENTS HAS TO BE DELETED
      const responseDeletedEvents = await Event.deleteMany({
        establishment: establishmentId,
      });
      // const userIdAct = await User.findById(user);
      // console.log('El user antes de actualizar:', userIdAct);
      req.flash('info', 'Establishment and his Events succesfully deleted.');
      res.redirect('/user');
    } catch (error) {
      next(error);
    }
  },
);

// DELETE ACCOUNT
router.get(
  '/profile/edit-user/:userId/delete',
  checkIfLoggedIn,
  async (req, res, next) => {
    const user1 = req.session.currentUser;
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('band establishment');
      // const establishmentId = userId.establishment;
      res.render('user/profile/delete-user', { user });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/profile/edit-user/:userId/delete',
  checkIfLoggedIn,
  async (req, res, next) => {
    const { userId } = req.params;
    const user1 = req.session.currentUser;
    console.log('The User antes de borrar:', user1);
    try {
      const user2 = await User.findById(userId);
      console.log('The User antes de borrar:', user2);
      if (user2.role.band) {
        const deletedBand = await Band.findByIdAndDelete(user2.band);
        console.log('Deleted Band: ', deletedBand);
      }
      if (user2.role.establishment) {
        const deletedEstablishment = await Establishment.findByIdAndDelete(
          user2.establishment,
        );
        console.log('Deleted Establishment: ', deletedEstablishment);
      }
      const deletedUser = await User.findByIdAndDelete(user2._id);
      console.log('Deleted User: ', deletedUser);
      // delete req.session;
      res.redirect('/logout');
    } catch (error) {
      next(error);
    }
  },
);

/* GET Renders available events of the user-> Show all the events of the user */
router.get('/events', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  console.log('El usuario de USER EVENTS: ', user);
  try {
    if (req.session.currentUser.role.establishment === false) {
      req.flash(
        'error',
        'Seems you don`t have any Establishment, First, Create one!!',
      );
      // res.redirect('/profile');
      res.redirect('/user');
    } else {
      const userFound = await User.findById(
        req.session.currentUser._id,
      ).populate('establishment');
      const fechaActual = fechaDeHoy();
      const fecha = fechaActual.split('-').reverse().join('/');
      const events = await Event.find({
        establishment: userFound.establishment._id,
      })
        .sort('schedule')
        .populate('registeredUsers establishment');
      console.log('Los eventos del USER con los datos: ', events);
      if (events.length > 0) {
        // res.render('user/events', { events, fechaActual, userFound });
        res.render('user/eventsX', { events, fecha, userFound });
      } else {
        req.flash('info', 'You don`t have events in your establishment yet.');
        res.redirect('/user');
      }
    }
  } catch (error) {
    next(error);
  }
});

/* GET Renders new event -> Show the page to create a new event */
router.get(
  '/events/new',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    try {
      const fechaActual = fechaDeHoy();
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
    const {
      name, description, price, durationMins, schedule, startTimeHour, startTimeMinutes,
    } = req.body;
    const actualUser = req.session.currentUser;
    // const userFound = await User.findOne({ email: actualUserEmail }).populate(
    //   'establishment',
    // ); // THIS IS THE CORRECT!!!
    // ONLY FOR TEST
    // ONLY FOR TEST Allow to insert Event without ESTABLISHMENT

    console.log('Lo qu eme viene de startTimeHour y Mínutes: ', startTimeHour, startTimeMinutes);
    console.log('Lo que viene en Schedule: ', schedule);
    const minutes = startTimeMinutes.toString();
    const hours = startTimeHour.toString();
    const startTime = hours.concat(':').concat(minutes);
    console.log('La hora introducida: ', startTime);
    try {
      // const userFound = await User.findById(actualUserId);

      const eventNew = await Event.create({
        name,
        description,
        price,
        durationMins,
        schedule,
        startTime,
        establishment: actualUser.establishment,
      });
      // Poner FLASH notification
      req.flash(
        'success',
        ` The event ${name} has been created successfully!!`,
      );
      res.redirect('/user/events'); // A donde vamos?
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/events/bookings',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    try {
      const fechaActual = fechaDeHoy();
      const fecha = fechaActual
        .split('/')
        .reverse()
        .join('/');
      const actualUserId = req.session.currentUser._id;
      const userFound = await User.findById(actualUserId).populate(
        'establishment',
      );
      console.log('UserFound', userFound);
      if (userFound.role.establishment === false) {
        req.flash(
          'error',
          'Sorry, seems your are not a Establishment owner, FIRST CREATE ONE!!',
        );
        // res.redirect('/profile');
        res.redirect('/user/events');
      } else {
        const userEstablishmentID = userFound.establishment._id;
        const events = await Event.find({
          establishment: userEstablishmentID,
          band: { $exists: false },
        }).sort('schedule');
        console.log('EVENTOS ORDENADOS por fecha del ESTABLISHMENT: ', events);
        console.log('FECHA ', fechaActual);
        console.log('events ', events);
        res.render('user/events/bookings', { events, fecha, userFound });
      }
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/events/bookedevents',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('/')
      .reverse()
      .join('/');
    const actualUserId = req.session.currentUser._id;

    try {
      const userFound = await User.findById(actualUserId).populate(
        'establishment',
      );
      console.log('UserFound', userFound);
      if (userFound.role.establishment === false) {
        req.flash(
          'error',
          'Sorry, seems your are not a Establishment owner, FIRST CREATE ONE!!',
        );
        // res.redirect('/profile');
        res.redirect('/user/events');
      } else {
        const userEstablishmentID = userFound.establishment._id;
        const events = await Event.find({
          establishment: userEstablishmentID,
          band: { $exists: true },
        }).sort('schedule');
        console.log('EVENTOS ORDENADOS por fecha del ESTABLISHMENT: ', events);
        console.log('FECHA ', fechaActual);
        console.log('events ', events);
        res.render('user/events/bookedevents', { events, fecha, userFound });
      }
    } catch (error) {
      next(error);
    }
  },
);

// GETS the band petitions landing page
router.get('/profile/petitions', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userBand = await Band.findById(user.band).populate(
      'bandmembers petitions',
    );
    console.log('userBand ', user);

    res.render('user/profile/petitions', { user, userBand });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/profile/petitions/:bandId/:petitionUserId/decline',
  async (req, res, next) => {
    const { bandId, petitionUserId } = req.params;
    const { username, email } = req.body;
    // const actualUserEmail = req.session.currentUser.email;
    const userID = req.session.currentUser._id;
    // console.log('userId:', userID);
    if (username === '' || email === '') {
      req.flash('error', 'No empty fields allowed.');
      res.redirect('/profile/edit-user');
    }

    try {
      const band = await Band.findByIdAndUpdate(
        bandId,
        {
          $pull: { petitions: petitionUserId },
        },
        { new: true },
      );

      req.flash('info', 'Usuario rechazado');
      res.redirect('/user/profile/petitions');
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/profile/petitions/:bandId/:petitionUserId/accept',
  async (req, res, next) => {
    const { bandId, petitionUserId } = req.params;
    try {
      const band = await Band.findByIdAndUpdate(
        bandId,
        {
          $pull: { petitions: petitionUserId },
          $push: { bandmembers: petitionUserId },
        },
        { new: true },
      );
      const updateRole = await User.findByIdAndUpdate(
        petitionUserId,
        {
          band: bandId,
          $set: {
            'role.band': true,
          },
        },
        { new: true },
      );

      console.log('baaaand: ', updateRole);
      req.flash('info', 'Usuario Aceptado');
      res.redirect('/user/profile/petitions');
    } catch (error) {
      next(error);
    }
  },
);

// GET to render the form to update de event.
router.get(
  '/events/:eventId/edit',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const fechaActual = fechaDeHoy();
    const userId = req.session.currentUser;
    const { eventId } = req.params;
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId).populate(
        'establishment band',
      );
      res.render('user/events/update', { event, user, fechaActual });
    } catch (error) {
      next(error);
    }
  },
);

// POST to update de event.
router.post('/events/:eventId/edit', async (req, res, next) => {
  const { eventId } = req.params;
  const {
    name,
    description,
    schedule,
    startTime,
    price,
    durationMins,
  } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { name, description, schedule, startTime, price, durationMins },
      { new: true },
    );
    req.flash('success', `Event ${updatedEvent} succesfully updated.`);
    res.redirect('/user/events');
  } catch (error) {
    next(error);
  }
});

// GET to render the CONFIRM to proceed to DELETE de event.
router.get(
  '/events/:eventId/delete',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const fechaActual = fechaDeHoy();
    const userId = req.session.currentUser;
    const { eventId } = req.params;
    try {
      const user = await User.findById(userId);
      console.log('El usuario para borrar:', user);
      // const event = await Event.findById(eventId).populate('establishment band');
      const event = await Event.findById(eventId);
      if (event.establishment._id.equals(user.establishment)) {
        res.render('user/events/delete', { user, event, fechaActual });
      } else {
        req.flash(
          'warniing',
          `${user.name}, you are not the owner of the Event.`,
        );
        res.redirect('/user/events');
      }
    } catch (error) {
      next(error);
    }
  },
);

// POST PROCESS EVENT delete, we should NOTIFICATE TO THE REGISTERED USERS THAT THE EVENT HAS BEEN DELETED
router.post(
  '/events/:eventId/delete',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const userId = req.session.currentUser;
    const { eventId } = req.params;
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);
      const registeredUsers = await Event.findById(eventId).populate(
        'registeredUsers',
      );
      console.log('El evento que quiero borrar:', event);
      if (event.establishment._id.equals(user.establishment)) {
        // Si tiene banda hay que avisar a la banda que se ha eliminado el evento
        if (event.band != null) {
          console.log('Tiene banda, tenemos que avisar a la banda...');
        } else {
          console.log('NO tiene banda,');
        }
        // Si tiene Usuarios Registrados, se les tiene que avisar
        if (registeredUsers.length > 0) {
          console.log('Tenemos que avisar a los users:');
        } else {
          console.log('NO tienes users Registrados');
        }
        // Aquí tenemos que borrar el evento!!
        const deletedEvent = await Event.findByIdAndDelete(event);
        // console.log('Deleted Event:', deletedEvent);
        // const event2 = await Event.findById(eventId);
        // console.log('Event2', event2);
        req.flash(
          'success',
          `The ${deletedEvent.name} has been deleted succesfully!!`,
        );
        res.redirect('/user/events');
      } else {
        req.flash(
          'warning',
          ' You are trying to delete an Event that you are not the owner',
        );
        res.redirect('/users/events');
      }
    } catch (error) {
      next(error);
    }
  },
);

// UPLOAD BAND AVATAR
router.post('/profile/edit-band-avatar', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  const userBandId = await User.findById(user);
  const bandId = userBandId.band;
  const form = new formidable.IncomingForm();

  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/images/avatar/bands/${bandId}_avatar`; // __dirname now is the router path
  });

  // save in database
  form.on('file', async (name, file) => {
    req.flash('info', 'upload ');
    const avatar = `/images/avatar/bands/${bandId}_avatar`;
    await Band.findByIdAndUpdate(bandId, {
      avatar,
    });
    res.redirect('/user/profile/edit-band-avatar');
  });
  // error control
  form.on('error', err => {
    req.resume();
    req.flash('error', `Some error happen ${err}`);
  });
  // aborted control
  form.on('aborted', () => {
    console.log('user aborted upload');
  });
});

//Get to avatar band edit page
router.get('/profile/edit-band-avatar', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id).populate(
    'band establishment',
  );
  const userBandId = await User.findById(user);
  const bandId = userBandId.band;

  req.flash('info', 'photo uploaded');
  res.render('user/profile/edit-band-avatar', {
    user,
    bandId,
  });
});

// UPLOAD ESTABLISHMENT AVATAR
router.post('/profile/edit-establishment-avatar', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  const userEstablishmentId = await User.findById(user);
  const establishmentId = userEstablishmentId.establishment;
  const form = new formidable.IncomingForm();

  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/images/avatar/establishments/${establishmentId}_avatar`; // __dirname now is the router path
  });

  form.on('file', async (name, file) => {
    req.flash('info', 'upload ');
    const avatar = `/images/avatar/establishments/${establishmentId}_avatar`;
    await Establishment.findByIdAndUpdate(establishmentId, {
      avatar,
    });
    res.redirect('/user/profile/edit-establishment-avatar');
  });
  form.on('error', err => {
    req.resume();
    req.flash('error', `Some error happen ${err}`);
  });
  form.on('aborted', () => {
    console.log('user aborted upload');
  });
});

//Get to avatar establishment edit page
router.get('/profile/edit-establishment-avatar', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id).populate(
    'band establishment',
  );
  const userEstablishmentId = await User.findById(user);
  const establishmentId = userEstablishmentId.establishment;
  // console.log('userEstablishmentId ', userEstablishmentId);
  // console.log('establishmentId ', establishmentId);

  req.flash('info', 'photo uploaded');
  res.render('user/profile/edit-establishment-avatar', {
    user,
    establishmentId,
  });
});
// GET to delete picture.
router.get(
  '/profile/delete/establishment-avatar',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const user = await User.findById(req.session.currentUser._id).populate(
      'band establishment',
    );
    const userEstablishmentId = await User.findById(user);
    const establishmentId = userEstablishmentId.establishment;
    try {
      // const deletedAvatar = await Establishment.findByIdAndDelete(
      //   establishmentId,
      //   { avatar },
      // );
      res.render('/profile/delete/establishment-avatar');
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  '/profile/delete/establishment-avatar',
  checkIfLoggedIn,
  checkIfEstablishment,
  async (req, res, next) => {
    const user = await User.findById(req.session.currentUser._id).populate(
      'band establishment',
    );
    const userEstablishmentId = await User.findById(user);
    const establishmentId = userEstablishmentId.establishment;
    try {
      const deletedAvatar = await Establishment.findByIdAndDelete(
        establishmentId.avatar,
      );
      console.log('deletedAvatar:', deletedAvatar);

      res.redirect('/profile/delete/establishment-avatar');
    } catch (error) {
      next(error);
    }
  },
);
module.exports = router;

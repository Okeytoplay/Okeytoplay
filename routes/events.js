const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const { checkIfLoggedIn } = require('../middlewares/auth');
const { checkIfBand } = require('../middlewares/user');
const { fechaDeHoy } = require('../public/javascripts/fecha');

const router = express.Router();

/* GET Renders available events -> Show all the events */
router.get('/', async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('-')
      .reverse()
      .join('/');
    const events = await Event.find({ schedule: { $gte: fechaActual } })
      .sort('schedule')
      .populate('establishment band');
    console.log('EVENTOS ORDENADOS y NO PASADOS DE FECHA: ', events);
    // const fechaActual = fechaDeHoy();
    console.log('FECHA ', fechaActual);

    // const events2 = events.map((event) => ({
    //   schedule: event.schedule.toDateString(),
    // }));
    // events.forEach((event) => {
    //   console.log('ALGO: ', event);
    //   event.schedule2 = event.schedule.toDateString();
    // });

    // var result = arr.map(person => ({ value: person.id, text: person.name }));

    // const events2 = events.flatMap((event) => {
    //   event.schedule = event.schedule.toDateString();
    // });
    console.log('events Modificado', events);
    res.render('events', { events, fechaActual, fecha });
  } catch (error) {
    next(error);
  }
});

/* GET Renders available events, only with BAND JOINED */
router.get('/bookedevents', async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('-')
      .reverse()
      .join('/');

    const events = await Event.find({ schedule: { $gte: fechaActual }, band: { $exists: true } }).sort('schedule').populate('establishment band');
    console.log('Eventos CON banda adjudicada: ', events);
    // res.render('events/bookedevents', { events });
    res.render('events/show', { events });
  } catch (error) {
    next(error);
  }
});

/* GET Renders available events, only with NO BAND JOINED */
router.get('/bookingevents', checkIfLoggedIn, checkIfBand, async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('-')
      .reverse()
      .join('/');

    const events = await Event.find({ schedule: { $gte: fechaActual }, band: { $exists: false } }).sort('schedule').populate('establishment');
    console.log('Eventos SIN banda adjudicada: ', events);
    res.render('events/bookings', { events });
    // res.render('events/show', { events });
  } catch (error) {
    next(error);
  }
});

/**     ELIMINAR RUTA EVENTS/NEW */

/* GET Renders new event -> Show the page to create a new event */
// Falta comprobación MIDDLEWARE de ser ESTABLISHMENT para poder crear EVENTOS

// router.get('/new', checkIfLoggedIn, async (req, res, next) => {
//   try {
//     const fechaActual = fechaDeHoy();
//     res.render('events/new', { fechaActual });
//   } catch (error) {
//     next(error);
//   }
//   // falta comprobacion para q grupie/banda
//   // no puedan crear un evento
// });

/* POST Create NEW EVENT */

// router.post('/new', checkIfLoggedIn, async (req, res, next) => {
//   const { name, description, price, durationMins, schedule } = req.body;
//   const actualUserEmail = req.session.currentUser.email;
//   // const userFound = await User.findOne({ email: actualUserEmail }).populate(
//   //   'establishment',
//   // ); // THIS IS THE CORRECT!!!
//   // ONLY FOR TEST
//   // ONLY FOR TEST Allow to insert Event without ESTABLISHMENT
//   try {
//     const userFound = await User.findOne({ email: actualUserEmail });
//     const eventNew = await Event.create({
//       name,
//       description,
//       price,
//       durationMins,
//       schedule,
//       establishmentId: userFound.establishment,
//     });
//     // Poner FLASH notification
//     req.flash('success', ` El evento ${name} ha sido creado con exito`);
//     res.redirect('/');
//   } catch (error) {
//     next(error);
//   }
// });

// router.post('/new', checkIfLoggedIn, (req, res, next) => {
//   const { name, date } = req.body;
//   Event.create({
//     name,
//     date,
//   })
//     .then((event) => {
//       res.redirect('/');
//     })
//     .catch(next);
// });

/* GET Renders event information */
router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('establishment band');
    console.log('el evento encontrado', event);
    res.render('events/show', { event });
  } catch (error) {
    next(error);
  }
});

/* POST Renders event information */
// router.post('/:eventId', async (req, res, next) => {
//   const { eventId } = req.params;
//   try {
//     const events = await Event.find({ _id: eventId });
//     console.log('events ', events);
//     res.redirect(`/events/${eventId}`);
//   } catch (error) {
//     next(error);
//   }
// });

/* Join al event */
router.get('/:eventId/join', checkIfLoggedIn, async (req, res, next) => {
  const fechaActual = fechaDeHoy();
  const fecha = fechaActual.split('-').reverse().join('/');
  const { eventId } = req.params;
  const userFound = req.session.currentUser;

  try {
    const event = await Event.findById(eventId).populate('registeredUsers');
    if (event.registeredUsers) {
      // Comprobar que él no esté ya registrado
      let booked = false;
      event.registeredUsers.forEach((user) => {
        if (user.email === userFound.email) {
          booked = true;
        }
      });
      if (!booked) {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, { $push: { registeredUsers: userFound } }, { new: true });
        console.log('El evento despues de hacer update: ', updatedEvent);
        req.flash('success', 'Registered ok!');
      } else {
        req.flash('warning', 'You were already registered to this event');
      }
      // const alreadyRegistered = event.registeredUsers.includes(userFound);

      // console.log('YA registrado?: ', alreadyRegistered);
      // console.log('Entro aquí');
      // const updatedEvent = await Event.findByIdAndUpdate(eventId, { $push: { registeredUsers: userFound } }, { new: true });
    } else {
      // const updatedEvent = await Event.findByIdAndUpdate(eventId, { $push: { registeredUsers: userFound._id } });
      // console.log('El usuario metido en el array del evento: ', updatedEvent);
    }
    const events = await Event.find({ registeredUsers: userFound });
    console.log('Los eventos a los que me he unido: ', events);
    res.render('user/events/bookedevents', { events, fecha, userFound });
  } catch (error) {
    next(error);
  }
});

/* GET Renders event information */
router.get('/bookingevents/:eventId', async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('establishment band');
    console.log('el evento encontrado', event);
    const bandAction = true;
    res.render('events/show', { event, bandAction });
    // res.render('events/show', event);
  } catch (error) {
    next(error);
  }
});
/* Join al event */
router.get('/bookingevents/:eventId/join', checkIfLoggedIn, async (req, res, next) => {
  const fechaActual = fechaDeHoy();
  const fecha = fechaActual.split('-').reverse().join('/');
  const { eventId } = req.params;
  const userFound = req.session.currentUser;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, { band: userFound }, { new: true });
    console.log('Updated Event: ', updatedEvent);

    res.redirect('/events');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

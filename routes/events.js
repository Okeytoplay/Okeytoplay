const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const { checkIfLoggedIn } = require('../middlewares/auth');
const { fechaDeHoy } = require('../public/javascripts/fecha');

const router = express.Router();

/* GET Renders available events -> Show all the events */
router.get('/', async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('/')
      .reverse()
      .join('/');
    const events = await Event.find({ schedule: { $gte: fechaActual } })
      .sort('schedule')
      .populate('establishment band');
    console.log('EVENTOS ORDENADOS y NO PASADOS DE FECHA: ', events);
    // const fechaActual = fechaDeHoy();
    console.log('FECHA ', fechaActual);
    console.log('events ', events);
    res.render('events', { events, fechaActual, fecha });
  } catch (error) {
    next(error);
  }
});

/* GET Renders new event -> Show the page to create a new event */
// Falta comprobación MIDDLEWARE de ser ESTABLISHMENT para poder crear EVENTOS
router.get('/new', checkIfLoggedIn, async (req, res, next) => {
  try {
    const fechaActual = fechaDeHoy();
    res.render('events/new', { fechaActual });
  } catch (error) {
    next(error);
  }
  // falta comprobacion para q grupie/banda
  // no puedan crear un evento
});

/* POST Create NEW EVENT */

router.post('/new', checkIfLoggedIn, async (req, res, next) => {
  const { name, description, price, durationMins, schedule } = req.body;
  const actualUserEmail = req.session.currentUser.email;
  // const userFound = await User.findOne({ email: actualUserEmail }).populate(
  //   'establishment',
  // ); // THIS IS THE CORRECT!!!
  // ONLY FOR TEST
  // ONLY FOR TEST Allow to insert Event without ESTABLISHMENT
  try {
    const userFound = await User.findOne({ email: actualUserEmail });
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
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

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
    res.render('events/show', event);
  } catch (error) {
    next(error);
  }
});

/* POST Renders event information */
router.post('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const events = await Event.find({ _id: eventId });
    console.log('events ', events);
    res.redirect(`/events/${eventId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

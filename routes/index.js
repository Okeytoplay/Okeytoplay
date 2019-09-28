const express = require('express');
const Event = require('../models/Event');
const Establishment = require('../models/Establishment');
const Band = require('../models/Band');
const { fechaDeHoy } = require('../public/javascripts/fecha');

const router = express.Router();

// router.get('/', (req, res, next) => {
//   Event.find()
//     .populate('establishment band registeredUsers')
//     .then(events => {
//       console.log('events ', events);
//       res.render('index', { events });
//     })
//     .catch(next);
// });

router.get('/', async (req, res, next) => {
  // const actualUserEmail = req.session.currentUser.email;
  try {
    const fechaActual = fechaDeHoy();
    const fecha = fechaActual
      .split('-')
      .reverse()
      .join('/');
    // const events = await Event.find().populate('establishment band');
    // TODO: filtrar eventos cerrados con banda
    const events = await Event.find({ schedule: { $gte: fechaActual }, band: { $exists: true } }).sort('schedule').populate('establishment band');
    console.log('eveeeents: ', events);
    req.session.Aux = true;
    res.render('index', { events, fecha });
  } catch (error) {
    next(error);
  }
});

/* GET Log Out and redirect to HomePage */
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});
module.exports = router;

const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');

const mongoose = require('mongoose');

const router = express.Router();

/* GET Renders event information */
router.get('/new', (req, res, next) => {
  res.render('events/new');
});

/* GET Renders available events */
router.get('/', (req, res, next) => {
  Event.find()
    .then(events => {
      console.log('events ', events);
      res.render('events', { events });
    })
    .catch(next);
});

/* GET Renders event information */
router.get('/:eventId', (req, res, next) => {
  const { eventId } = req.params;

  Event.findById(eventId)
    .then(events => {
      res.render('events/show', { events });
    })
    .catch(next);
});

/* POST Renders event information */
router.post('/:eventId', (req, res, next) => {
  const { eventId } = req.params;
  Event.find(
    { _id: eventId }
      .then(events => {
        console.log('events ', events);
        res.redirect(`/events/${eventId}`);
      })
      .catch(next),
  );
});

module.exports = router;

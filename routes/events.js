const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User'); 


const mongoose = require('mongoose');

const router = express.Router();

/* GET Renders available events */
router.get('/', (req, res, next) => {
  Event.find()
    .then(events => {
      console.log('events ', events);
      res.render('events', { events });
    })
    .catch(next);
});

module.exports = router;

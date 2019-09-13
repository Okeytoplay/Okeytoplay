
// RUTA PENDIENTE DE HACER

const express = require('express');
const Establishment = require('../models/Establishment');

const mongoose = require('mongoose');

const router = express.Router();

/* GET Renders available establishments */
router.get('/', (req, res, next) => {
  Establishment.find()
    .then(establishments => {
      console.log('establishments ', establishments);
      res.render('establishments', { establishments });
    })
    .catch(next);
});

/* GET Renders event information */
router.get('/:establishmentId', (req, res, next) => {
  const { establishmentId } = req.params;

  Establishment.findById(establishmentId)
    .then(establishments => {
      res.render('establishments/show', { establishments });
    })
    .catch(next);
});

/* POST Renders event information */
router.post('/:establishmentId', (req, res, next) => {
  const { establishmentId } = req.params;
  Establishment.find(
    { _id: establishmentId }
      .then(establishments => {
        console.log('establishments ', establishments);
        res.redirect(`/establishments/${establishmentId}`);
      })
      .catch(next),
  );
});

module.exports = router;

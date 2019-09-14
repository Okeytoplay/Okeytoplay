const express = require('express');
const mongoose = require('mongoose');
const Band = require('../models/Band');

const router = express.Router();

/* GET Renders available bands */
router.get('/', (req, res, next) => {
  Band.find()
    .then(bands => {
      console.log('bands ', bands);
      res.render('bands', { bands });
    })
    .catch(next);
});

/* GET Renders new Band*/
router.get('/new', (req, res, next) => {
  res.render('bands/new');
});

// /* GET Renders band information */
// router.get('/:bandId', (req, res, next) => {
//   const { bandId } = req.params;

//   Band.findById(bandId)
//     .then(bands => {
//       res.render('bands/show', { bands });
//     })
//     .catch(next);
// });

// /* POST Renders band information */
// router.post('/:bandId', (req, res, next) => {
//   const { bandId } = req.params;
//   Band.find(
//     { _id: bandId }
//       .then(bands => {
//         console.log('bands ', bands);
//         res.redirect(`/bands/${bandId}`);
//       })
//       .catch(next),
//   );
// });

module.exports = router;

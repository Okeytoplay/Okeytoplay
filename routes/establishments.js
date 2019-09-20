const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Establishment = require('../models/Establishment');

const router = express.Router();

/* GET Renders available establishments */
router.get('/', async (req, res, next) => {
  try {
    const establishments = await Establishment.find()
    console.log('establishments ', establishments);
    res.render('establishments', { establishments });
  } catch (error) {
    next(error);
  }
});

// /* GET Renders available establishments */
// router.get('/', async (req, res, next) => {
//   const searchAllEstablishments = await Establishment.find();
//   console.log('establishments ', establishments);
//   try {
//     res.render('establishments', { searchAllEstablishments });
//   } catch (error) {
//     next(error);
//   }
// });

/* GET Renders new establishment */
router.get('/new', (req, res, next) => {
  res.render('establishments/new');
});

/* POST for the new establishment */
router.post('/new', async (req, res, next) => {
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
  const actualUserEmail = req.session.currentUser.email;
  console.log('email: ', actualUserEmail);
  try {
    let newEstablishment;
    let updatedUser;
    newEstablishment = await Establishment.create({
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
    });
    const userFound = await User.findOne({ email: actualUserEmail });
    updatedUser = await User.updateOne(
      { _id: userFound._id },
      {
        $set: {
          'role.establishment': true,
          establishment: newEstablishment,
        },
      },
      {
        new: true,
      },
    );

    // res.redirect('/user/profile');
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// /* GET Renders event information */
// router.get('/:establishmentId', (req, res, next) => {
//   const { establishmentId } = req.params;

//   Establishment.findById(establishmentId)
//     .then(establishments => {
//       res.render('establishments/show', { establishments });
//     })
//     .catch(next);
// });

// /* POST Renders event information */
// router.post('/:establishmentId', (req, res, next) => {
//   const { establishmentId } = req.params;
//   Establishment.find(
//     { _id: establishmentId }
//       .then(establishments => {
//         console.log('establishments ', establishments);
//         res.redirect(`/establishments/${establishmentId}`);
//       })
//       .catch(next),
//   );
// });

module.exports = router;

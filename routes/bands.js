const express = require('express');
const mongoose = require('mongoose');
const Band = require('../models/Band');
const User = require('../models/User');
const {
  checkFields,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares/auth');
const router = express.Router();

router.post('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  // console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band establishment',
  );
  // const userID = userFound._id;
  try {
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
    res.render('bands', { userFound, role });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  // console.log(actualUserEmail);
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band establishment',
  );
  const bands = await Band.find();
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('bands', { userFound, bands });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});
// /* GET Renders available bands */
// router.get('/', (req, res, next) => {
//   Band.find()
//     .then(bands => {
//       console.log('bands ', bands);
//       res.render('bands', { bands });
//     })
//     .catch(next);
// });

/* GET Renders new Band */
router.get('/new', (req, res, next) => {
  res.render('bands/new');
});

/* POST for the new Band */
router.post('/new', async (req, res, next) => {
  const {
    name,
    genre,
    description,
    website,
    instagramProfile,
    facebookProfile,
    avatar,
  } = req.body;
  const actualUserEmail = req.session.currentUser.email;
  console.log('email: ', actualUserEmail);
  try {
    let newBand;
    let updatedUser;
    newBand = await Band.create({
      name,
      genre,
      description,
      website,
      instagramProfile,
      facebookProfile,
      avatar,
    });
    const userFound = await User.findOne({ email: actualUserEmail });
    updatedUser = await User.updateOne(
      { _id: userFound._id },
      {
        $set: {
          'role.band': true,
          band: newBand,
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

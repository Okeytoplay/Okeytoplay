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
  try {
    const userFound = await User.findOne({ email: actualUserEmail }).populate(
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
    res.redirect('bands', { userFound, role });
  } catch (error) {
    next(error);
  }
});

router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  // console.log(actualUserEmail);
  try {
    const userFound = await User.findOne({ email: actualUserEmail }).populate(
      'band establishment',
    );
    const bands = await Band.find();
    // const userID = userFound._id;
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('bands', { userFound, bands });
  } catch (error) {
    next(error);
  }
});

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
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

/* POST Renders band information */
router.post('/', async (req, res, next) => {
  const {
    name,
    genre,
    description,
    website,
    instagramProfile,
    facebookProfile,
    avatar,
  } = req.body;
  try {
    res.redirect(`/bands/${bandId}`);
  } catch (error) {
    next(error);
  }
});
// View one band detail
router.get('/:bandID', async (req, res, next) => {
  const { bandID } = req.params;
  try {
    const bands = await Band.findById(bandID);
    res.render('bands/show', { bands });
  } catch (error) {
    next(error);
  }
});

/* POST Renders band information */
router.post('/:bandID', async (req, res, next) => {
  const { bandID } = req.params;
  try {
    const bands = await Band.findById(bandID);
    res.redirect(`/bands/${bandId}`);
  } catch (error) {
    next(error);
  }
});
// Join one band
router.get('/:bandID/join', async (req, res, next) => {
  const { bandID } = req.params;
  const userID = req.session.currentUser._id;
  try {
    const bandAddData = await User.findByIdAndUpdate(
      userID,
      {
        band: bandID,
      },
      { new: true },
    );
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

// // View for any word search
// router.get('/', async (req, res, next) => {
//   const { query } = req.params;
//   console.log('query: ', query);

//   try {
//     console.log('query: ', query);
//     const bandName = await Band.find(
//       { name: req.params.query },
//       res.render(':query', bandName),
//     );
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;

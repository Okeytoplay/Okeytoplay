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
  console.log('BandIdJoin:', bandID);
  const userID = req.session.currentUser._id;
  console.log('UserIdJoin:', userID);

  try {
    // // const user = await User.findById(userID).populate('band');
    // // let band = await Band.findById(bandID);
    // const userAssignedToBand = await User.findByIdAndUpdate(
    //   actualUserId,
    // ).populate('band');

    // band = await Class.findByIdAndUpdate(
    //   userID,
    //   { $push: { band: bandID } },
    //   { new: true },
    // );
    const bandAddData = await User.findByIdAndUpdate(
      userID,
      {
        band: bandID,
      },
      { new: true },
    );
    console.log('bandAddData:', bandAddData);
    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});
module.exports = router;

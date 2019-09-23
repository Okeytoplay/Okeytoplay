const express = require('express');
const mongoose = require('mongoose');
const Band = require('../models/Band');
const User = require('../models/User');
const formidable = require('formidable');

const {
  checkFields,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
} = require('../middlewares/auth');

const router = express.Router();

router.post('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  try {
    const userFound = await User.findOne({ email: actualUserEmail }).populate(
      'band establishment',
    );
    const role = ['Groupie'];
    if (userFound.role.band) {
      role.push('Band');
    }
    if (userFound.role.establisment) {
      role.push('Establishment');
    }
    res.redirect('bands', { userFound, role });
  } catch (error) {
    next(error);
  }
});

router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const actualUserEmail = req.session.currentUser.email;
  try {
    const userFound = await User.findOne({ email: actualUserEmail }).populate(
      'band establishment',
    );
    const bands = await Band.find();
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
    const push = await Band.findByIdAndUpdate(newBand._id, {
      $push: { bandmembers: userFound._id },
    });
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
  const user = req.session.currentUser;
  const checkIfpetition = await Band.findById(bandID);

  console.log('checkIfpetition: ', checkIfpetition);

  try {
    const bands = await Band.findById(bandID);
    res.render('bands/show', { bands, user, checkIfpetition });
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
    const band = await Band.findByIdAndUpdate(bandID, {
      $push: { petitions: userID },
    });
    req.flash('info', 'La peticion ha sido enviada a la banda');
    res.redirect('/user/profile/petitions');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

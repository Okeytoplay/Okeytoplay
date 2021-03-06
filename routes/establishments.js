const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Establishment = require('../models/Establishment');
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
    res.render('establishments', { userFound, role });
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
    const establishments = await Establishment.find();
    res.render('establishments', { userFound, establishments });
  } catch (error) {
    next(error);
  }
});

/* GET Renders available establishments */
router.get('/', async (req, res, next) => {
  try {
    const establishments = await Establishment.find();
    res.render('establishments', { establishments });
  } catch (error) {
    next(error);
  }
});

/* GET Renders new establishment */
router.get('/new', checkIfLoggedIn, (req, res, next) => {
  res.render('establishments/new');
});

/* POST for the new establishment */
router.post('/new', checkIfLoggedIn, async (req, res, next) => {
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
  const actualUser = req.session.currentUser;
  if (name === '' || street === '' || city === '') {
    req.flash('error', 'No empty fields allowed.');
    res.redirect('/establishments/new');
  }
  try {
    // let newEstablishment;
    // let updatedUser;
    const newEstablishment = await Establishment.create({
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
    // const userFound = await User.findOne({ email: actualUserEmail });
    console.log('Actuaal User: ', actualUser);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: actualUser._id },
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
    console.log('updated useeer: ', updatedUser);
    req.session.currentUser = updatedUser;
    console.log('req sesion curent useeer: ', req.session.currentUser);

    res.redirect('/user');
  } catch (error) {
    next(error);
  }
});

/* POST Renders Establishment information */
router.post('/', async (req, res, next) => {
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
  try {
    res.redirect(`/establishments/${establishmentId}`);
  } catch (error) {
    next(error);
  }
});

// View one establishment detail
router.get('/:establishmentID', checkIfLoggedIn, async (req, res, next) => {
  const { establishmentID } = req.params;
  try {
    const establishments = await Establishment.findById(establishmentID);
    res.render('establishments/show', { establishments });
  } catch (error) {
    next(error);
  }
});

/* POST Renders establishment information */
router.post('/:establishmentID', checkIfLoggedIn, async (req, res, next) => {
  const { establishmentID } = req.params;
  try {
    const establishments = await Establishment.findById(establishmentID);
    res.redirect(`/establishments/${establishmentID}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

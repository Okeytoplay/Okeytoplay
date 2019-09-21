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
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band establishment',
  );
  try {
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
  const userFound = await User.findOne({ email: actualUserEmail }).populate(
    'band establishment',
  );
  const bands = await Band.find();
  try {
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
// // Join one band
// router.get('/:bandID/join', async (req, res, next) => {
//   const { bandID } = req.params;
//   const userID = req.session.currentUser._id;
//   try {
//     const bandAddData = await User.findByIdAndUpdate(
//       userID,
//       {
//         band: bandID,
//       },
//       { new: true },
//     );
//     res.redirect('/user');
//   } catch (error) {
//     next(error);
//   }
// });

// UPLOAD IMAGES AVATAR
router.post('/avatar/avatar-upload', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  const userBandId = await User.findById(user);
  const bandId = userBandId.band;
  console.log('User ID: ', user);
  console.log('band ID: ', bandId);

  // formidable is a npm package
  const form = new formidable.IncomingForm();

  form.parse(req);
  // you need control where you put the file
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/images/avatar/${user.id}_avatar`; // __dirname now is the router path
  });

  // save the file path into de date base
  form.on('file', async (name, file) => {
    req.flash('info', 'upload ');
    const avatar = `/images/avatar/${user.id}_avatar`; // the path estart inside of public/
    await Band.findByIdAndUpdate(bandId, {
      avatar,
    });
    res.redirect('/bands/avatar/avatar-upload');
  });
  // error control
  form.on('error', err => {
    req.resume();
    req.flash('error', `Some error happen ${err}`);
  });
  // aborted control
  form.on('aborted', () => {
    console.log('user aborted upload');
  });
});

router.get('/avatar/avatar-upload', async (req, res) => {
  const user = await User.findById(req.session.currentUser._id).populate(
    'band establishment',
  );
  const userBandId = await User.findById(user);
  const bandId = userBandId.band;
  console.log('WhatIsUser:', user);
  console.log('WhatIsBandId:', bandId);

  req.flash('info', 'photo uploaded');
  res.render('bands/avatar/avatar-upload', {
    user,
    bandId,
  });
});

// Join one band
router.get('/:bandID/join', async (req, res, next) => {
  const { bandID } = req.params;
  const userID = req.session.currentUser._id;
  try {
    const band = await Band.findByIdAndUpdate(bandID, {
      $push: { petitions: userID },
    });
    console.log('bandID: ', band);
    req.flash('info', 'La peticion ha sido enviada a la banda');
    res.redirect('/user/profile/petitions');
  } catch (error) {
    next(error);
  }
});

router.get('/:bandID/check', async (req, res, next) => {
  const { bandID } = req.params;

  try {
    const petitions = await Band.findById(bandID).populate('petitions');
    res.render('user/profile/petitions', { petitions, bandID });
  } catch (error) {
    next(error);
  }
});

router.get('/:bandID/decline', async (req, res, next) => {
  const { bandID } = req.params;
  const userID = req.session.currentUser._id;

  try {
    const band = await Band.findByIdAndUpdate(bandID, {
      $pull: { petitions: userID },
    });
    req.flash('info', 'Usuario rechazado');
    res.render('user/profile/petitions');
  } catch (error) {
    next(error);
  }
});

router.get('/:bandID/accept', async (req, res, next) => {
  const { bandID } = req.params;
  const userID = req.session.currentUser._id;
  try {
    const band = await Band.findByIdAndUpdate(bandID, {
      $push: { members: userID },
    });
    const pull = await Band.findByIdAndUpdate(bandID, {
      $pull: { petitions: userID },
    });

    req.flash('info', 'Usuario Aceptado');
    res.render('user/profile/petitions');
  } catch (error) {
    next(error);
  }
});

module.exports = router;

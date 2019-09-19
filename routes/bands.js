const express = require('express');
const mongoose = require('mongoose');
const Band = require('../models/Band');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
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
    res.render('bands', { userFound, role });
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
router.post('/new', upload.single('avatar'), async (req, res, next) => {
  const {
    name,
    genre,
    description,
    website,
    instagramProfile,
    facebookProfile,
  } = req.body;
  const avatar = `./public/uploads/${req.file.filename}`;
  const actualUserEmail = req.session.currentUser.email;
  try {
    const newBand = await Band.create({
      name,
      genre,
      description,
      website,
      instagramProfile,
      facebookProfile,
      avatar,
    });
    const userFound = await User.findOne({ email: actualUserEmail });
    await User.updateOne(
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

// View for any word search
// router.get('/', async (req, res, next) => {
//   const { query } = req.query;
//   try {
//     console.log('query: ', query);
//     const bandName = await Band.find(
//       { name: req.query },
//       res.render(':query', bandName),
//     );
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/', (req, res, next) => {
//   Band.find({ name: req.query.bandName }, (error, band) => {
//     if (error) {
//       next(error);
//     } else {
//       res.render('/', { name: band });
//     }
//   });
// });

module.exports = router;

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
    res.render('establishments', { userFound, role });
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
  const establishments = await Establishment.find();
  // const userID = userFound._id;
  try {
    // const user = await User.findById(userID);
    // res.render('user/profile', { userFound, title: 'Profile' });
    // res.render('user/profile', userFound, role);
    // res.render('user/profile', { userFound });
    res.render('establishments', { userFound, establishments });
  } catch (error) {
    next(error);
  }
  // res.render('user/profile');
});

// /* GET Renders available establishments */
// router.get('/', (req, res, next) => {
//   Establishment.find()
//     .then(establishments => {
//       console.log('establishments ', establishments);
//       res.render('establishments', { establishments });
//     })
//     .catch(next);
// });

/* GET Renders available establishments */
router.get('/', async (req, res, next) => {
  const searchAllEstablishments = await Establishment.find();
  console.log('establishments ', establishments);
  try {
    res.render('establishments', { searchAllEstablishments });
  } catch (error) {
    next(error);
  }
});

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
router.get('/:establishmentID', async (req, res, next) => {
  const { establishmentID } = req.params;
  try {
    const establishments = await Establishment.findById(establishmentID);
    res.render('establishments/show', { establishments });
  } catch (error) {
    next(error);
  }
});
/* POST Renders establishment information */
router.post('/:establishmentID', async (req, res, next) => {
  const { establishmentID } = req.params;
  try {
    const establishments = await Establishment.findById(establishmentID);
    res.redirect(`/establishments/${establishmentId}`);
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

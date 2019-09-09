const express = require('express');
const bcrypt = require('bcrypt'); // Bcrypt to encrypt passwords
const User = require('../models/User'); // User Model
const { checkFields, checkEmailAndPasswordNotEmpty } = require('../middlewares/auth');

const router = express.Router();

const bcryptSalt = 10; // bcrypt.

/* GET SignUp page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

/* POST from SignUp */
router.post('/signup', checkFields, checkEmailAndPasswordNotEmpty, async (req, res, next) => {
  // const { username, email, password } = req.body;
  const { username, email, password } = res.locals.auth; // info viene del Middleware

  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      req.flash('error', `Sorry, this ${email} has an account on the site!!`);
      console.log('USUARIO EXISTE');
      res.redirect('/auth/signup');
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ username, email, hashedPassword });
    req.session.currentUser = newUser;
    req.flash('success', `${username}, your account has been created.`);
    // res.redirect('/profile');  //Aquí tenemos que redirigir cuando tengamos la routa y la vista
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

/* GET Log In page. */
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

/* POST Log In */ // Recoger los datos del formulario
router.post('/login', checkEmailAndPasswordNotEmpty, async (req, res, next) => {
  const { email, password } = res.locals.auth; // info viene del Middleware
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        console.log('Estoy Logueado OK'); // Se tendrá que quitar, es para ver donde redirigimos una vez logueados
        res.redirect('/'); // Revisar ruta a donde redirigir
      } else {
        console.log('Aqui 2');
        req.flash('error', 'User o pswd not correct!!.');
        res.render('auth/login'); // Revisar ruta a donde redirigir
      }
    } else {
      console.log('Aqui 3, NO EXISTE USUARIO');
      res.redirect('/auth/signup'); // Revisar ruta a donde redirigir
    }
  } catch (error) {
    req.flash('error', 'try again');
    res.redirect('/signup'); // Revisar ruta a donde redirigir
  }
})

module.exports = router;

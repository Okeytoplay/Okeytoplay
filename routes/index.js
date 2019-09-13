const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  //Events.find().populate().populate()
  // res.render('index, {events, })
  res.render('index', { title: 'Express Xavi' });

});

/* GET Log Out and redirect to HomePage */
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});
module.exports = router;

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});
module.exports = router;

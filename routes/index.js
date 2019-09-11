const express = require("express");
const Events = require("../models/events");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

/* GET Log Out and redirect to HomePage */
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});
module.exports = router;

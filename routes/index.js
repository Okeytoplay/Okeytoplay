const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Renders homepage
router.get("/", (req, res, next) => {
  res.render("index", { title: "OkeyToPlay" });
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

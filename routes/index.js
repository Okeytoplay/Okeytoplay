const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    res.render("index", { title: "OkeyToPlay" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

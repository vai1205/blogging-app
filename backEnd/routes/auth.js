const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/auth");

//validators
const { runValidation } = require("../validators/index");
const {
  userSignUpValidator,
  userSignInValidator
} = require("../validators/auth");

router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/signin", userSignInValidator, runValidation, signin);
router.get("/signout", signout);

module.exports = router;

const express = require("express");
const router = express.Router();
const { categoryCreateValidator } = require("../validators/category");
const { runValidation } = require("../validators/index");
const { requireSignIn, adminMiddleWare } = require("../controllers/auth");
const { create } = require("../controllers/category");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignIn,
  adminMiddleWare,
  create
);

module.exports = router;

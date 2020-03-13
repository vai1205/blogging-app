const express = require("express");
const router = express.Router();
const { categoryCreateValidator } = require("../validators/category");
const { runValidation } = require("../validators/index");
const { requireSignIn, adminMiddleWare } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/category");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignIn,
  adminMiddleWare,
  create
);
router.get("/categories", list);
router.get("/category/:slug", read);
router.delete(
  "/category/:slug",
  requireSignIn,
  adminMiddleWare,
  remove
);

module.exports = router;

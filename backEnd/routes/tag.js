const express = require("express");
const router = express.Router();
const { tagCreateValidator } = require("../validators/tag");
const { runValidation } = require("../validators/index");
const { requireSignIn, adminMiddleWare } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/tag");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignIn,
  adminMiddleWare,
  create
);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignIn, adminMiddleWare, remove);

module.exports = router;

const express = require("express");
const router = express.Router();
const { read } = require("../controllers/user");
const { requireSignIn, authMiddleWare } = require("../controllers/auth");

router.get("/profile", requireSignIn, authMiddleWare, read);

module.exports = router;

const express = require("express");
const router = express.Router();
const {create} = require('../controllers/blog')
const {requireSignIn,adminMiddleWare}= require('../controllers/auth')

router.post("/blog",requireSignIn, adminMiddleWare, create);

module.exports = router;

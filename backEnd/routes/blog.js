const express = require("express");
const router = express.Router();
const {response} = require('../controllers/blog')
router.get("/", response);
module.exports = router;

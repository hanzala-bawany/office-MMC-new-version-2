const express = require("express");
const { unifiedLogin } = require("../controllers/authController.js");

const router = express.Router();

router.post("/login", unifiedLogin);

module.exports = router;

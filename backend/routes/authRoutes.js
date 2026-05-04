const express = require("express");
const { unifiedLogin, logoutDoctor } = require("../controllers/authController.js");

const router = express.Router();

router.post("/login", unifiedLogin);
router.post("/logout", logoutDoctor);

module.exports = router;

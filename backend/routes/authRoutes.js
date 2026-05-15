const express = require("express");
const { unifiedLogin, logoutDoctor , forceLogoutDoctor } = require("../controllers/authController.js");

const router = express.Router();

router.post("/login", unifiedLogin);
router.post("/logout", logoutDoctor);
router.post('/admin/force-logout' , forceLogoutDoctor);
// router.post('/admin/force-logout', verifyToken, isAdmin, forceLogoutDoctor);

module.exports = router;

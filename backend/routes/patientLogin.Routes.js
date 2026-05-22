const express = require("express");
const { patientLogin,patientLoginMrno } = require("../controllers/patientLogin.Controller");


const router = express.Router();

router.post("/login", patientLogin);
router.post('/login/verify', patientLoginMrno);


module.exports = router;

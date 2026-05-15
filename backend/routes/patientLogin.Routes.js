const express = require("express");
const { patientLogin } = require("../controllers/patientLogin.Controller");


const router = express.Router();

router.post("/login", patientLogin);


module.exports = router;

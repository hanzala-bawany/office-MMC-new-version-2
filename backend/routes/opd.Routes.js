const express = require("express");
const router = express.Router();

const { getTodayDoctorPatients} = require("../controllers/opd.controller");

router.get("/patients", getTodayDoctorPatients);

module.exports = router;

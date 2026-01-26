const express = require("express");
const router = express.Router();

const { getTodayDoctorPatients,getDoctorPatients} = require("../controllers/opd.controller");

router.get("/patients", getTodayDoctorPatients);
router.get("/doctor-patients/:doctorId", getDoctorPatients);
module.exports = router;

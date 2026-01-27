const express = require("express");
const router = express.Router();

const { getTodayDoctorPatients,getDoctorPatients,getDoctorNextPatient} = require("../controllers/opd.controller");

router.get("/patients", getTodayDoctorPatients);
router.get("/doctor-patients/:doctorId", getDoctorPatients);
router.post("/doctor/next-patient", getDoctorNextPatient);
module.exports = router;

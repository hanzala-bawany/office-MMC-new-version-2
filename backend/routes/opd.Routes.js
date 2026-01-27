const express = require("express");
const router = express.Router();

const { getTodayDoctorPatients,getDoctorNextPatient,getDoctorPatientsWithStats} = require("../controllers/opd.controller");

router.get("/patients", getTodayDoctorPatients);
router.get("/doctor-patients/:doctorId", getDoctorPatientsWithStats);
router.post("/doctor/next-patient", getDoctorNextPatient);
module.exports = router;

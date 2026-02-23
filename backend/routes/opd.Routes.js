
const express = require("express");
const router = express.Router();

const { getTodayDoctorPatients, getDoctorNextPatient, getDoctorPatientsWithStats, getDoctorNextPatientSkip, getDoctorNextPatientQueue, cancelAllDoctorPatients } = require("../controllers/opd.controller");

router.get("/patients", getTodayDoctorPatients);
router.get("/doctor-patients/:doctorId", getDoctorPatientsWithStats);
router.post("/doctor/next-patient", getDoctorNextPatient);
router.post("/doctor/patient-skipped", getDoctorNextPatientSkip);
router.post("/doctor/patient-skipped-call", getDoctorNextPatientQueue);
router.post("/doctor/patient-cancel-all", cancelAllDoctorPatients);
module.exports = router;

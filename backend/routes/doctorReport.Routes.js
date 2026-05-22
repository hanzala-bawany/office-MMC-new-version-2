const express = require("express");
const router = express.Router();

const {
  getDoctorReport,
  
} = require("../controllers/doctorReport.Controller");


router.get("/report", getDoctorReport);

module.exports = router;
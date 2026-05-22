const express = require("express");
const router = express.Router();

const {
  getDoctorsByFacultyAndDate,
  
} = require("../controllers/consultantFacultyController");


router.get("/doctors-by-faculty", getDoctorsByFacultyAndDate);

module.exports = router;
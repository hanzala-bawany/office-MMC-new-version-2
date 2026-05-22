
const express = require("express");
const router = express.Router();

const {  getHmsFaculties, getScreenFacultyMap, saveScreenFacultyMap, } = require("../controllers/screenDisplayController");

router.get("/hms-faculties", getHmsFaculties);
router.get("/screen-faculty-map", getScreenFacultyMap);
router.post("/screen-faculty-map", saveScreenFacultyMap);


module.exports = router;

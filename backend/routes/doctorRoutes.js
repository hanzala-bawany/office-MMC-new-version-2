const express = require("express");
const { manageDoctor, getDoctors, getDoctorReport } = require("../controllers/doctorController.js");
const { dynamicMiddleware } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/manage", dynamicMiddleware, manageDoctor);

router.get("/list", getDoctors);

router.get("/sharingReport", getDoctorReport);


module.exports = router;

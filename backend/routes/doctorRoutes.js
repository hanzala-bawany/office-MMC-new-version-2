const express = require("express");
const { manageDoctor, getDoctors, uploadCSV, uploadDoctorsCSV, getDoctors1,getDoctorImage } = require("../controllers/doctorController.js");
const { dynamicMiddleware } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/manage", dynamicMiddleware, manageDoctor);
router.post("/upload-csv", uploadCSV .single("file"),
  uploadDoctorsCSV
);

router.get("/list", getDoctors);
router.get("/list1", getDoctors1);
router.get('/list2/:id', getDoctorImage);

module.exports = router;

const express = require("express");
const { manageDoctor, getDoctors, uploadCSV, uploadDoctorsCSV, } = require("../controllers/doctorController.js");
const { dynamicMiddleware } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/manage", dynamicMiddleware, manageDoctor);
router.post("/upload-csv", uploadCSV .single("file"),
  uploadDoctorsCSV
);

router.get("/list", getDoctors);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  getConsultants,
  upsertConsultantImage,
  deleteConsultantImage
} = require("../controllers/consultantController");

// 📌 GET all consultants (sab data + image)
router.get("/", getConsultants);

// 📌 ADD/UPDATE image only
router.post("/image", upload.single("image"), upsertConsultantImage);

// 📌 DELETE image only
router.delete("/:consultant_id/image", deleteConsultantImage);

module.exports = router;
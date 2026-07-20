const express = require("express");
const { getPatientCategory, getOpdCategory, getAllConsultantByOpdCategory, getReference } = require("../controllers/receptionistController");
const { verifyToken } = require("../middleware/authMiddleWare");

const receptionistRoutes = express.Router();

receptionistRoutes.get("/opdCategory", verifyToken , getOpdCategory);
receptionistRoutes.get("/patientCategory", getPatientCategory);
receptionistRoutes.get("/allConsultant", getAllConsultantByOpdCategory);
receptionistRoutes.get("/reference/:patientid", getReference);


module.exports = receptionistRoutes;

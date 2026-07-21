const express = require("express");
const { getPatientCategory, getOpdCategory, getAllConsultantByOpdCategory, getReference, getAllMembers, addEditOpdReceipt, getLastPatient } = require("../controllers/receptionistController");
const { verifyToken } = require("../middleware/authMiddleWare");

const receptionistRoutes = express.Router();

receptionistRoutes.use(verifyToken);

receptionistRoutes.get("/opdCategory", getOpdCategory);
receptionistRoutes.get("/patientCategory", getPatientCategory);
receptionistRoutes.get("/allConsultant", getAllConsultantByOpdCategory);
receptionistRoutes.get("/members", getAllMembers);
receptionistRoutes.get("/reference/:patientid", getReference);

receptionistRoutes.post("/opdAddPatient", addEditOpdReceipt);
receptionistRoutes.get("/lastPatient", getLastPatient);


module.exports = receptionistRoutes;

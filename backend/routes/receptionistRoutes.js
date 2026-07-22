const express = require("express");
const { getPatientCategory, getOpdCategory, getAllConsultantByOpdCategory, getReference, getAllMembers, addEditOpdReceipt, getLastPatient, getLabTest } = require("../controllers/receptionistController");
const { verifyToken } = require("../middleware/authMiddleWare");

const receptionistRoutes = express.Router();

receptionistRoutes.use(verifyToken);

receptionistRoutes.get("/opdCategory", getOpdCategory);
receptionistRoutes.get("/patientCategory", getPatientCategory);
receptionistRoutes.get("/allConsultant", getAllConsultantByOpdCategory);
receptionistRoutes.get("/members", getAllMembers);
receptionistRoutes.get("/reference/:patientid", getReference);
receptionistRoutes.get("/lastPatient/:userName", getLastPatient);
receptionistRoutes.get("/getLabTest", getLabTest);

receptionistRoutes.post("/opdAddPatient", addEditOpdReceipt);


module.exports = receptionistRoutes;

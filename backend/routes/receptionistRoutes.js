const express = require("express");
const { getPatientCategory, getUsers , getOpdCategory, getAllConsultantByOpdCategory, getReference, getAllMembers, addEditOpdReceipt, getLast10Patient, getLabTest, getMemberDependent, getPatientsbyFilter, deleteRefundOpdReceipt, getCurrentCashBySession } = require("../controllers/receptionistController");
const { verifyToken } = require("../middleware/authMiddleWare");

const receptionistRoutes = express.Router();

receptionistRoutes.use(verifyToken);

receptionistRoutes.get("/opdCategory", getOpdCategory);
receptionistRoutes.get("/patientCategory", getPatientCategory);
receptionistRoutes.get("/allConsultant", getAllConsultantByOpdCategory);
receptionistRoutes.get("/members", getAllMembers);
receptionistRoutes.get("/members/:newNo", getMemberDependent);
receptionistRoutes.get("/reference", getReference);
receptionistRoutes.get("/lastPatient/:userName", getLast10Patient);
receptionistRoutes.get("/getLabTest", getLabTest);
receptionistRoutes.get("/users", getUsers);
receptionistRoutes.get("/filterPatients", getPatientsbyFilter);

receptionistRoutes.post("/opdAddandEditPatient", addEditOpdReceipt);
receptionistRoutes.post("/deleteAndRefundPatient", deleteRefundOpdReceipt);


module.exports = receptionistRoutes;

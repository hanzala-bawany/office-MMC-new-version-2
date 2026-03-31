const oracledb = require("oracledb");
const poolPromise = require("../database.js");

//-------Queue Display Screen--------------------

const getTodayDoctorPatients = async (req, res) => {
  let connection;

  try {
    const { patientStatus } = req.query;
    // example: ?patientStatus=2

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_today_doctor_patients(
          :VPatientStatus,
          :cursor
        );
      END;
      `,
      {
        VPatientStatus: patientStatus,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.status(200).json({
      status: 200,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};




// const getDoctorPatientsWithStats = async (req, res) => {
//   let connection;
//   try {
//     const { doctorId } = req.params;

//     const pool = await poolPromise;
//     connection = await pool.getConnection();

//     const result = await connection.execute(
//       `
//       BEGIN
//         get_doctor_patients_with_stats(
//           p_doc_id      => :doc_id,
//           p_today_total => :today_total,
//           p_checked     => :checked,
//           p_remaining   => :remaining,
//           p_skipped     => :skipped,
//           p_cancel      => :canceled,
//           retval         => :cursor1,
//           retval1        => :cursor2,
//           retval2        => :cursor3
//         );
//       END;
//       `,
//       {
//         doc_id: doctorId,
//         today_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//         checked: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//         remaining: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//         skipped: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
//         canceled: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },

//         cursor1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//         cursor2: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//         cursor3: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
//       },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     // ===== READ CURSORS =====
//     const rs1 = result.outBinds.cursor1; // patients
//     const rs2 = result.outBinds.cursor2; // diagnosis
//     const rs3 = result.outBinds.cursor3; // tests

//     const patients = await rs1.getRows();
//     const diagnosisList = await rs2.getRows();
//     const testList = await rs3.getRows();

//     await rs1.close();
//     await rs2.close();
//     await rs3.close();

//     res.status(200).json({
//       status: 200,
//       data: {
//         todayAppointments: result.outBinds.today_total,
//         patientsChecked: result.outBinds.checked,
//         patientsRemaining: result.outBinds.remaining,
//         patientsSkipped: result.outBinds.skipped,
//         patientsCanceled: result.outBinds.canceled,
//         patients,
//         diagnosisList,
//         testList
//       }
//     });

//   } catch (err) {
//     console.error("getDoctorPatientsWithStats error:", err);
//     res.status(500).json({
//       status: 500,
//       message: "Internal Server Error",
//       error: err.message
//     });
//   } finally {
//     if (connection) await connection.close();
//   }
// };


//------- NEXT PATIENT API ------------------

// const getDoctorNextPatient = async (req, res) => {
//   let connection;
//   try {
//     let { doctorId, receiptNo, remarks, primaryDiagnosis, medicalTests, treatment } = req.body;

//     // Normalize empty strings to null
//     const normalize = val => (val && val.trim() !== "" ? val : null);
//     receiptNo = normalize(receiptNo);
//     remarks = normalize(remarks);
//     primaryDiagnosis = normalize(primaryDiagnosis);
//     medicalTests = normalize(medicalTests);
//     treatment = normalize(treatment);

//     const pool = await poolPromise;
//     connection = await pool.getConnection();

//     const result = await connection.execute(
//       `
//       BEGIN
//         get_doctor_next_patient(
//           p_doc_id        => :doc_id,
//           p_receiptno     => :receiptno,
//           p_remarks       => :remarks,
//           p_primary_diag  => :primary_diag,
//           p_medical_tests => :medical_tests,
//           p_treatment     => :treatment,
//           retval          => :cursor1,
//           retval1         => :cursor2,
//           retval2         => :cursor3
//         );
//       END;
//       `,
//       {
//         doc_id: doctorId,
//         receiptno: receiptNo,
//         remarks,
//         primary_diag: primaryDiagnosis,
//         medical_tests: medicalTests,
//         treatment,
//         cursor1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//         cursor2: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//         cursor3: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
//       },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
//     );

//     // ===== READ CURSORS =====
//     const rs1 = result.outBinds.cursor1;
//     const rs2 = result.outBinds.cursor2;
//     const rs3 = result.outBinds.cursor3;

//     const patients = await rs1.getRows();
//     const diagnosisList = await rs2.getRows();
//     const testList = await rs3.getRows();

//     await rs1.close();
//     await rs2.close();
//     await rs3.close();

//     // Next patient (SQL already returns current patient)
//     const currentPatient = patients[0];

//     if (!currentPatient) {
//       console.log(" No current patient found");
//     } else {
//       console.log(" Current Patient:", currentPatient);
//     }

//     // SOCKET EMIT
//     const io = req.app.get("io");
//     io.emit("QUEUE_UPDATED", {
//       type: "NEXT_PATIENT",
//       doctorId,
//       patientToken: currentPatient?.TOKENNO_1,  
//       doctorName: currentPatient?.DOCTOR_NAME,
//       // patient: currentPatient
//     });

//     res.json({
//       success: true,
//       currentPatient,
//       diagnosisList,
//       testList
//     });

//   } catch (err) {
//     console.error("getDoctorNextPatient error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch next patient",
//       error: err.message
//     });
//   } finally {
//     if (connection) await connection.close();
//   }
// };
// ------- NEXT PATIENT API with SOCKET ------------------

const getDoctorPatientsWithStats = async (req, res) => {
  let connection;
  try {
    const { doctorId } = req.params;
    const { status } = req.query;
    const statusFilter = status ? Number(status) : 2;

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_doctor_patients_with_stats(
          p_doc_id         => :doc_id,
          p_status_filter  => :status_filter,
          p_today_total    => :today_total,
          p_checked        => :checked,
          p_remaining      => :remaining,
          p_skipped        => :skipped,
          p_cancel         => :canceled,
          retval           => :cursor1,
          retval1          => :cursor2,
          retval2          => :cursor3,
          p_skipped_tokens => :cursor4,
          retval3          => :cursor5 
        );
      END;
      `,
      {
        doc_id: doctorId,
        status_filter: statusFilter,
        today_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        checked:     { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        remaining:   { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        skipped:     { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        canceled:    { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        cursor1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor2: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor3: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor4: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor5: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rs1 = result.outBinds.cursor1;
    const rs2 = result.outBinds.cursor2;
    const rs3 = result.outBinds.cursor3;
    const rs4 = result.outBinds.cursor4;
    const rs5 = result.outBinds.cursor5;

    const patients = await rs1.getRows();

    //  Sirf status 2 pe
    let diagnosisList, testList, skippedTokens, patientVitals;
    if (statusFilter === 2) {
      diagnosisList  = await rs2.getRows();
      testList       = await rs3.getRows();
      skippedTokens  = await rs4.getRows();
      patientVitals  = await rs5.getRows();
    }

    await rs1.close();
    await rs2.close();
    await rs3.close();
    await rs4.close();
    await rs5.close();

    //  Response conditionally build
    const responseData = {
      todayAppointments:  result.outBinds.today_total,
      patientsChecked:    result.outBinds.checked,
      patientsRemaining:  result.outBinds.remaining,
      patientsSkipped:    result.outBinds.skipped,
      patientsCanceled:   result.outBinds.canceled,
      patients,
    };

    if (statusFilter === 2) {
      responseData.diagnosisList     = diagnosisList;
      responseData.testList          = testList;
      responseData.skippedTokenList  = skippedTokens;
      responseData.patientVitals     = patientVitals;
    }

    res.status(200).json({ status: 200, data: responseData });

  } catch (err) {
    console.error("getDoctorPatientsWithStats error:", err);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const getDoctorNextPatient = async (req, res) => {
  let connection;

  try {
    let { doctorId, receiptNo, remarks, primaryDiagnosis, medicalTests, treatment } = req.body;

    // ================= NORMALIZE STRINGS ONLY =================
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);
    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);

    // ================= ENSURE ARRAYS =================
    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_doctor_next_patient(
          p_doc_id        => :doc_id,
          p_receiptno     => :receiptno,
          p_remarks       => :remarks,
          p_primary_diag  => :primary_diag,
          p_medical_tests => :medical_tests,
          p_treatment     => :treatment,
          retval          => :cursor1
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptno: receiptNo,
        remarks: remarks,

        // ===== ORACLE COLLECTION BIND =====
        primary_diag: {
          dir: oracledb.BIND_IN,
          val: primaryDiagnosis,
          type: "TY_MEDICINE"   // ⚠️ Schema type check
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE"
        },

        // STRING BIND (Correct)
        treatment: treatment,

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      }
    );

    // ================= READ CURSOR =================
    const rs = result.outBinds.cursor1;
    const rows = await rs.getRows(1); // Only 1 patient expected
    await rs.close();

    const currentPatient = rows[0] || null;
    console.log(currentPatient, "<<<<<<<<<<<<<<<<<<<<<<");

    // ================= SOCKET EMIT =================
    // if (currentPatient) {
    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "NEXT_PATIENT",
      doctorId,
      patientToken: currentPatient?.TOKENNO_1,
      doctorName: currentPatient?.DOCTOR_NAME,
    });
    // }

    res.json({
      success: true,
      currentPatient
    });

  } catch (err) {
    console.error("getDoctorNextPatient error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient",
      error: err.message
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error("Connection close error:", e); }
    }
  }
};


// ------- NEXT PATIENT SKIP API with SOCKET { Skip Api } ------------------
const getDoctorNextPatientSkip = async (req, res) => {
  let connection;

  try {
    let { doctorId, receiptNo } = req.body;

    // ================= NORMALIZE STRINGS =================
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_doctor_next_patient_skip(
          p_doc_id    => :doc_id,
          p_receiptno => :receiptno,
          retval      => :cursor1
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptno: receiptNo,

        // OUT cursor
        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      }
    );

    // ================= READ CURSOR =================
    const rs = result.outBinds.cursor1;
    const rows = await rs.getRows(1); // Only 1 patient expected
    await rs.close();

    const nextPatient = rows[0] || null;
    console.log(nextPatient, "<<<<<<<<<<<<<<<< NEXT SKIP PATIENT");

    // ================= SOCKET EMIT =================

    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "NEXT_PATIENT_SKIP",
      doctorId,
      patientToken: nextPatient?.TOKENNO_1,
      doctorName: nextPatient?.DOCTOR_NAME,
    });


    res.json({
      success: true,
      nextPatient
    });

  } catch (err) {
    console.error("getDoctorNextPatientSkip error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient (skip)",
      error: err.message
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error("Connection close error:", e); }
    }
  }
};


// ------- NEXT PATIENT QUEUE API with SOCKET { skip call } ------------------
const getDoctorNextPatientQueue = async (req, res) => {
  let connection;

  try {
    let { doctorId, receiptNo, remarks, primaryDiagnosis, medicalTests, treatment } = req.body;

    // ================= NORMALIZE STRINGS =================
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);
    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);

    // ================= ENSURE ARRAYS =================
    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // ================= CALL PROCEDURE =================
    const result = await connection.execute(
      `
      BEGIN
        get_doctor_next_patient_queue(
          p_doc_id        => :doc_id,
          p_receiptno     => :receiptno,
          p_remarks       => :remarks,
          p_primary_diag  => :primary_diag,
          p_medical_tests => :medical_tests,
          p_treatment     => :treatment,
          retval          => :cursor1
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptNo: receiptNo,
        remarks: remarks,

        // ===== ORACLE COLLECTION BIND =====
        primary_diag: {
          dir: oracledb.BIND_IN,
          val: primaryDiagnosis,
          type: "TY_MEDICINE"
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE"
        },

        // STRING BIND
        treatment: treatment,

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      }
    );

    // ================= READ CURSOR =================
    const rs = result.outBinds.cursor1;
    const rows = await rs.getRows(1); // Only 1 patient expected
    await rs.close();

    const nextPatient = rows[0] || null;
    console.log(nextPatient, "<<<<<<<<<<<<<<<< NEXT Skip Call Api PATIENT QUEUE");

    // ================= SOCKET EMIT =================

    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "NEXT_PATIENT_QUEUE",
      doctorId,
      patientToken: nextPatient?.TOKENNO_1,
      doctorName: nextPatient?.DOCTOR_NAME,
    });


    res.json({
      success: true,
      nextPatient
    });

  } catch (err) {
    console.error("getDoctorNextPatientQueue error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient from queue",
      error: err.message
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error("Connection close error:", e); }
    }
  }
};


// ------- CANCEL ALL PATIENTS API ------------------
const cancelAllDoctorPatients = async (req, res) => {
  let connection;

  try {
    let { doctorId, receiptNo } = req.body;

    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);

    const pool = await poolPromise;
    connection = await pool.getConnection();

    await connection.execute(
      `
      BEGIN
        doctor_patient_cancel_all(
          p_doc_id    => :doc_id,
          p_receiptno => :receiptno
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptno: receiptNo
      },
      {
        autoCommit: true
      }
    );

    console.log("ALL PATIENTS CANCELLED FOR DOCTOR:", doctorId);

    // SOCKET EMIT
    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "CANCEL_ALL_PATIENTS",
      doctorId
    });

    res.json({
      success: true,
      message: "All patients cancelled successfully"
    });

  } catch (err) {
    console.error("cancelAllDoctorPatients error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to cancel all patients",
      error: err.message
    });
  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (e) { console.error("Connection close error:", e); }
    }
  }
};


// ------- MANUAL TOKEN CALL BY TOKENNO API with SOCKET ------------------
const doctorCallTokenByNumber = async (req, res) => {
  let connection;

  try {
    let {
      doctorId,
      tokenNo,
      remarks,
      primaryDiagnosis,
      medicalTests,
      treatment
    } = req.body;

    if (!doctorId || !tokenNo) {
      return res.status(400).json({
        success: false,
        message: "doctorId and tokenNo required"
      });
    }

    // Normalize
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);

    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        doctor_call_specific_tokenno(
          p_doc_id        => :doc_id,
          p_tokenno       => :tokenno,
          p_remarks       => :remarks,
          p_primary_diag  => :primary_diag,
          p_medical_tests => :medical_tests,
          p_treatment     => :treatment,
          retval          => :cursor1
        );
      END;
      `,
      {
        doc_id: doctorId,
        tokenno: tokenNo,
        remarks: remarks,

        primary_diag: {
          dir: oracledb.BIND_IN,
          val: primaryDiagnosis,
          type: "TY_MEDICINE"
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE"
        },

        treatment: treatment,

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      }
    );

    const rs = result.outBinds.cursor1;
    const rows = await rs.getRows(1);
    await rs.close();

    const currentPatient = rows[0] || null;

    if (currentPatient) {
      const io = req.app.get("io");
      io.emit("QUEUE_UPDATED", {
        type: "MANUAL_CALL_TOKEN",
        doctorId,
        patientToken: currentPatient.TOKENNO_1,
        doctorName: currentPatient.DOCTOR_NAME,
      });
    }

    res.json({
      success: true,
      currentPatient
    });

  } catch (err) {
    console.error("doctorCallTokenByNumber error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to call token manually",
      error: err.message
    });

  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (e) { console.error("Connection close error:", e); }
    }
  }
};


// ------- REPEAT CALL  PATIENT BY STATUS API with SOCKET ------------------
const repeatCallPatient = async (req, res) => {
  let connection;

  try {
    const { doctorId , doctorName , patientToken } = req.body;
    // console.log(doctorId, "docotr id");
    // console.log(doctorName, "doctorName");
    // console.log(patientToken, "patient Token");

    const io = req.app.get("io");

    io.emit("QUEUE_UPDATED", {
      type: "REPEAT_CALL",
      doctorId,
      patientToken: patientToken,
      doctorName: doctorName,
    });


    res.json({
      success: true,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};


// ---------  Active Consultants api -------------

const getActiveConsultants = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_active_consultants(
          :cursor
        );
      END;
      `,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    // ===== READ CURSOR =====
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.status(200).json({
      status: 200,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error("getActiveConsultants error:", err);

    res.status(500).json({
      status: 500,
      message: "Failed to fetch consultants",
      error: err.message
    });

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Connection close error:", err);
      }
    }
  }
};





// ------- ADD PATIENT VITALS API --------------------
const addPatientVitals = async (req, res) => {
  let connection;

  try {
    const {
      receiptNo,
      bloodPressure,
      bloodSugar,
      weight,
      height,
      temperature,
      pulse,
      createdBy
    } = req.body;

    // ================= NORMALIZE STRINGS =================
    const normalize = (val) => (val && val.trim() !== "" ? val.trim() : null);

    const p_receiptno = normalize(receiptNo);
    const p_blood_pressure = normalize(bloodPressure);
    const p_blood_sugar = normalize(bloodSugar);
    const p_weight = normalize(weight);
    const p_height = normalize(height);
    const p_temperature = normalize(temperature);
    const p_pulse = normalize(pulse);
    const p_created_by = normalize(createdBy);

    if (!p_receiptno) {
      return res.status(400).json({
        success: false,
        message: "receiptNo is required"
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // ================= CALL PROCEDURE =================
    await connection.execute(
      `
      BEGIN
        add_patient_vitals(
          p_receiptno      => :receiptNo,
          p_blood_pressure => :bloodPressure,
          p_blood_sugar    => :bloodSugar,
          p_weight         => :weight,
          p_height         => :height,
          p_temperature    => :temperature,
          p_pulse          => :pulse,
          p_created_by     => :createdBy
        );
      END;
      `,
      {
        receiptNo: p_receiptno,
        bloodPressure: p_blood_pressure,
        bloodSugar: p_blood_sugar,
        weight: p_weight,
        height: p_height,
        temperature: p_temperature,
        pulse: p_pulse,
        createdBy: p_created_by
      },
      {
        autoCommit: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Patient vitals added successfully"
    });

  } catch (err) {
    console.error("addPatientVitals error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add patient vitals",
      error: err.message
    });

  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error("Connection close error:", e); }
    }
  }
};


module.exports = {
  getTodayDoctorPatients, getDoctorNextPatient, getDoctorPatientsWithStats, cancelAllDoctorPatients, getDoctorNextPatientQueue, getDoctorNextPatientSkip, doctorCallTokenByNumber , repeatCallPatient,getActiveConsultants,addPatientVitals
};

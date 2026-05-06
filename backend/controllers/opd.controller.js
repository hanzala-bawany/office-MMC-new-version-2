const oracledb = require("oracledb");
const poolPromise = require("../database.js");

//-------Queue Display Screen--------------------

const getPronounceNameByDoctorId = async (connection, doctorId) => {
  try {
    const result = await connection.execute(
      `SELECT NVL(cp.pronounce_name, c.name) AS call_name
       FROM hms.consultant c
       LEFT JOIN consultant_pronounce cp
       ON cp.consultant_id = c.id
       WHERE c.id = :id`,
      { id: doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    return result.rows[0]?.CALL_NAME || null;
  } catch {
    return null;
  }
};

const getRoomNoByDoctorId = async (connection, doctorId) => {
  try {
    const result = await connection.execute(
      `SELECT NVL(room_no, 'Room Not Assigned') AS room_no
       FROM consultant_room
       WHERE consultant_id = :id`,
      { id: doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    return result.rows[0]?.ROOM_NO || "Room Not Assigned";
  } catch {
    return "Room Not Assigned";
  }
};


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
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.status(200).json({
      status: 200,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
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
          retval3          => :cursor5,
          retval4          => :cursor6
        );
      END;
      `,
      {
        doc_id: doctorId,
        status_filter: statusFilter,
        today_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        checked: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        remaining: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        skipped: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        canceled: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        cursor1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor2: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor3: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor4: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor5: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        cursor6: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const rs1 = result.outBinds.cursor1;
    const rs2 = result.outBinds.cursor2;
    const rs3 = result.outBinds.cursor3;
    const rs4 = result.outBinds.cursor4;
    const rs5 = result.outBinds.cursor5;
    const rs6 = result.outBinds.cursor6;

    const patients = await rs1.getRows();

    //  Sirf status 2 pe
    let diagnosisList, testList, skippedTokens, patientVitals, medicineList;
    if (statusFilter === 2) {
      diagnosisList = await rs2.getRows();
      testList = await rs3.getRows();
      skippedTokens = await rs4.getRows();
      patientVitals = await rs5.getRows();
      medicineList = await rs6.getRows();
    }

    await rs1.close();
    await rs2.close();
    await rs3.close();
    await rs4.close();
    await rs5.close();

    //  Response conditionally build
    const responseData = {
      todayAppointments: result.outBinds.today_total,
      patientsChecked: result.outBinds.checked,
      patientsRemaining: result.outBinds.remaining,
      patientsSkipped: result.outBinds.skipped,
      patientsCanceled: result.outBinds.canceled,
      patients,
    };

    if (statusFilter === 2) {
      responseData.diagnosisList = diagnosisList;
      responseData.testList = testList;
      responseData.medicineList = medicineList;
      responseData.skippedTokenList = skippedTokens;
      responseData.patientVitals = patientVitals;
    }

    res.status(200).json({ status: 200, data: responseData });
  } catch (err) {
    console.error("getDoctorPatientsWithStats error:", err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

const getDoctorNextPatient = async (req, res) => {
  let connection;

  try {
    let {
      doctorId,
      receiptNo,
      remarks,
      primaryDiagnosis,
      medicalTests,
      treatment,
      medicalPlan,
      medicine,
    } = req.body;

    // ================= NORMALIZE STRINGS ONLY =================
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);
    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);
    medicalPlan = normalizeString(medicalPlan);

    // ================= ENSURE ARRAYS =================
    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];
    medicine = Array.isArray(medicine) ? medicine : [];

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
          p_medical_plan  => :medical_plan,
          p_medicine      => :medicine,
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
          type: "TY_MEDICINE", // ⚠️ Schema type check
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE",
        },

        // STRING BIND (Correct)
        treatment: treatment,

        medical_plan: medicalPlan,

        medicine: {
          dir: oracledb.BIND_IN,
          val: medicine,
          type: "TY_MEDICINE",
        },

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
      },
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
      roomNo: currentPatient?.ROOM_NO,
      pronounceName: currentPatient?.PRONOUNCE_NAME,
    });
    // }

    res.json({
      success: true,
      currentPatient,
    });
  } catch (err) {
    console.error("getDoctorNextPatient error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
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
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
      },
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
      pronounceName: nextPatient?.PRONOUNCE_NAME,
      roomNo: nextPatient?.ROOM_NO,
    });

    res.json({
      success: true,
      nextPatient,
    });
  } catch (err) {
    console.error("getDoctorNextPatientSkip error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient (skip)",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
    }
  }
};

// ------- NEXT PATIENT QUEUE API with SOCKET { skip call } ------------------
const getDoctorNextPatientQueue = async (req, res) => {
  let connection;

  try {
    let {
      doctorId,
      receiptNo,
      remarks,
      primaryDiagnosis,
      medicalTests,
      treatment,
    } = req.body;

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
          type: "TY_MEDICINE",
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE",
        },

        // STRING BIND
        treatment: treatment,

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
      },
    );

    // ================= READ CURSOR =================
    const rs = result.outBinds.cursor1;
    const rows = await rs.getRows(1); // Only 1 patient expected
    await rs.close();

    const nextPatient = rows[0] || null;
    console.log(
      nextPatient,
      "<<<<<<<<<<<<<<<< NEXT Skip Call Api PATIENT QUEUE",
    );

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
      nextPatient,
    });
  } catch (err) {
    console.error("getDoctorNextPatientQueue error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch next patient from queue",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
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
        receiptno: receiptNo,
      },
      {
        autoCommit: true,
      },
    );

    console.log("ALL PATIENTS CANCELLED FOR DOCTOR:", doctorId);

    // SOCKET EMIT
    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "CANCEL_ALL_PATIENTS",
      doctorId,
    });

    io.emit("opdUpdated", {
      message: "New OPD Receipt Added",
      time: new Date(),
    });

    res.json({
      success: true,
      message: "All patients cancelled successfully",
    });
  } catch (err) {
    console.error("cancelAllDoctorPatients error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to cancel all patients",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
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
      treatment,
      medicalPlan,
      medicine,
    } = req.body;

    if (!doctorId || !tokenNo) {
      return res.status(400).json({
        success: false,
        message: "doctorId and tokenNo required",
      });
    }

    // Normalize
    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);
    medicalPlan = normalizeString(medicalPlan);

    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];
    medicalPlan = normalizeString(medicalPlan);

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
              p_medical_plan  => :medical_plan,
          p_medicine      => :medicine,
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
          type: "TY_MEDICINE",
        },

        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE",
        },

        treatment: treatment,

        medical_plan: medicalPlan,

        medicine: {
          dir: oracledb.BIND_IN,
          val: medicine,
          type: "TY_MEDICINE",
        },

        cursor1: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
      },
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
        pronounceName: currentPatient?.PRONOUNCE_NAME,
        roomNo: currentPatient?.ROOM_NO,
      });
    }

    res.json({
      success: true,
      currentPatient,
    });
  } catch (err) {
    console.error("doctorCallTokenByNumber error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to call token manually",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
    }
  }
};

// ------- REPEAT CALL  PATIENT BY STATUS API with SOCKET ------------------
const repeatCallPatient = async (req, res) => {
  let connection;
  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const { doctorId, doctorName, patientToken } = req.body;
    // console.log(doctorId, "docotr id");
    // console.log(doctorName, "doctorName");
    // console.log(patientToken, "patient Token");

    const io = req.app.get("io");

    const pronounceName = await getPronounceNameByDoctorId(
      connection,
      doctorId,
    );
    const roomNum = await getRoomNoByDoctorId(connection, doctorId);

    io.emit("QUEUE_UPDATED", {
      type: "REPEAT_CALL",
      doctorId,
      patientToken: patientToken,
      doctorName: doctorName,
      pronounceName: pronounceName,
      roomNo: roomNum,
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
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    // ===== READ CURSOR =====
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.status(200).json({
      status: 200,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("getActiveConsultants error:", err);

    res.status(500).json({
      status: 500,
      message: "Failed to fetch consultants",
      error: err.message,
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
      createdBy,
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
        message: "receiptNo is required",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // ================= CALL PROCEDURE =================
    const result = await connection.execute(
      `
      BEGIN
        add_edit_patient_vitals(
          p_receiptno      => :receiptNo,
          p_blood_pressure => :bloodPressure,
          p_blood_sugar    => :bloodSugar,
          p_weight         => :weight,
          p_height         => :height,
          p_temperature    => :temperature,
          p_pulse          => :pulse,
          p_created_by     => :createdBy,
          p_action         => :action
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
        createdBy: p_created_by,
        action: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      {
        autoCommit: true,
      },
    );

    const action = result.outBinds.action;

    res.status(200).json({
      success: true,
      message:
        action === "UPDATED"
          ? "Patient vitals updated successfully"
          : "Patient vitals added successfully",
    });
  } catch (err) {
    console.error("addPatientVitals error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add patient vitals",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Connection close error:", e);
      }
    }
  }
};

const doctorStop = async (req, res) => {
  let connection;
  try {
    let {
      doctorId,
      receiptNo,
      breakMessage,
      remarks,
      primaryDiagnosis,
      medicalTests,
      treatment,
      medicalPlan,
      medicine,
    } = req.body;

    const normalizeString = (val) =>
      typeof val === "string" && val.trim() !== "" ? val.trim() : null;

    receiptNo = normalizeString(receiptNo);
    remarks = normalizeString(remarks);
    treatment = normalizeString(treatment);
    medicalPlan = normalizeString(medicalPlan);
    breakMessage = normalizeString(breakMessage) || "On Break";

    primaryDiagnosis = Array.isArray(primaryDiagnosis) ? primaryDiagnosis : [];
    medicalTests = Array.isArray(medicalTests) ? medicalTests : [];
    medicine = Array.isArray(medicine) ? medicine : [];

    const pool = await poolPromise;
    connection = await pool.getConnection();

    await connection.execute(
      `
      BEGIN
        doctor_stop_break(
          p_doc_id        => :doc_id,
          p_receiptno     => :receiptno,
          p_message       => :message,
          p_remarks       => :remarks,
          p_primary_diag  => :primary_diag,
          p_medical_tests => :medical_tests,
          p_treatment     => :treatment,
          p_medical_plan  => :medical_plan,
          p_medicine      => :medicine
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptno: receiptNo,
        message: breakMessage,
        remarks: remarks,
        primary_diag: {
          dir: oracledb.BIND_IN,
          val: primaryDiagnosis,
          type: "TY_MEDICINE",
        },
        medical_tests: {
          dir: oracledb.BIND_IN,
          val: medicalTests,
          type: "TY_MEDICINE",
        },
        treatment: treatment,
        medical_plan: medicalPlan,
        medicine: {
          dir: oracledb.BIND_IN,
          val: medicine,
          type: "TY_MEDICINE",
        },
      },
      { autoCommit: true },
    );

    // Socket emit
    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "DOCTOR_ON_BREAK",
      doctorId,
      // patientToken: patientToken,
      // doctorName: doctorName,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("doctorStop error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

const setDoctorRoom = async (req, res) => {
  let connection;

  try {
    const { doctorId, roomNo } = req.body;

    if (!doctorId || !roomNo) {
      return res.status(400).json({
        success: false,
        message: "doctorId and roomNo required",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    await connection.execute(
      `
      BEGIN
        set_consultant_room(
          p_consultant_id => :consultant_id,
          p_room_no       => :room_no,
          p_updated_by    => :updated_by
        );
      END;
      `,
      {
        consultant_id: doctorId,
        room_no: roomNo,
        updated_by: doctorId,
      },
      {
        autoCommit: true,
      },
    );

    return res.json({
      success: true,
      message: "Room updated successfully",
    });
  } catch (err) {
    console.error("setDoctorRoom error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close().catch(() => {});
    }
  }
};

const getDoctorRoom = async (req, res) => {
  let connection;
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "doctorId is required",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `SELECT NVL(room_no, 'Room Not Assigned') AS room_no
       FROM consultant_room
       WHERE consultant_id = :id`,
      { id: doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const roomNo = result.rows[0]?.ROOM_NO || "Room Not Assigned";

    res.json({
      success: true,
      doctorId,
      roomNo,
    });
  } catch (err) {
    console.error("getDoctorRoom error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = {
  getTodayDoctorPatients,
  getDoctorNextPatient,
  getDoctorPatientsWithStats,
  cancelAllDoctorPatients,
  getDoctorNextPatientQueue,
  getDoctorNextPatientSkip,
  doctorCallTokenByNumber,
  repeatCallPatient,
  getActiveConsultants,
  addPatientVitals,
  doctorStop,
  setDoctorRoom,
  getDoctorRoom,
};

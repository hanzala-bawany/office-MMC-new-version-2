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



//-------------Get Doctor Patient by Id & Appoinment Details-----------------

const getDoctorPatientsWithStats = async (req, res) => {
  let connection;
  try {
    const { doctorId } = req.params;

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_doctor_patients_with_stats(
          :doc_id,
          :today_total,
          :checked,
          :remaining,
          :cursor
        );
      END;
      `,
      {
        doc_id: doctorId,
        today_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        checked: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        remaining: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    res.status(200).json({
      status: 200,
      data: {
        todayAppointments: result.outBinds.today_total,
        patientsChecked: result.outBinds.checked,
        patientsRemaining: result.outBinds.remaining,
        patients: rows
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message
    });
  } finally {
    if (connection) await connection.close();
  }
};


//-------next patient api------------------

const getDoctorNextPatient = async (req, res) => {
  let connection;
  try {
    let { doctorId, receiptNo, remarks, primaryDiagnosis, medicalTests, treatment } = req.body;

    // Normalize empty strings to null
    const normalize = val => val && val.trim() !== "" ? val : null;
    receiptNo = normalize(receiptNo);
    remarks = normalize(remarks);
    primaryDiagnosis = normalize(primaryDiagnosis);
    medicalTests = normalize(medicalTests);
    treatment = normalize(treatment);

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
          retval          => :cursor
        );
      END;
      `,
      {
        doc_id: doctorId,
        receiptno: receiptNo,
        remarks: remarks,
        primary_diag: primaryDiagnosis,
        medical_tests: medicalTests,
        treatment: treatment,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );

    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    //  SOCKET EMIT
    const io = req.app.get("io");
    io.emit("QUEUE_UPDATED", {
      type: "NEXT_PATIENT",
      doctorId,
      patient: rows
    });

    res.json({ success: true, nextPatient: rows });

  } catch (err) {
    console.error("getDoctorNextPatient error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch next patient", error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};




module.exports = {
  getTodayDoctorPatients,getDoctorNextPatient,getDoctorPatientsWithStats
};

const oracledb = require("oracledb");
const poolPromise = require("../database.js");

const getTodayDoctorPatients = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_today_doctor_patients(:cursor);
      END;
      `,
      {
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


//============== GET Doctor Patient By Id ------------------------

const getDoctorPatients = async (req, res) => {
  let connection;

  try {
    const { doctorId } = req.params; 

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        get_doctor_patients(:doc_id, :cursor);
      END;
      `,
      {
        doc_id: doctorId, 
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

module.exports = {
  getTodayDoctorPatients,getDoctorPatients
};

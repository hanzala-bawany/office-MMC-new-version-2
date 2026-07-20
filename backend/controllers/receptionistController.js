const oracledb = require("oracledb");
const poolPromise = require("../database.js");

const getOpdCategory = async (req, res) => {
  let connection;
  try {
    // connection = await poolPromise.getConnection();
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_opdcategory( retval => :retvals); END;`,
      {
        retvals: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retvals;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "OPD categories fetched successfully",
    });
  } catch (error) {
    console.error("Error in getOpdCategory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching OPD categories",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const getPatientCategory = async (req, res) => {
  let connection;
  try {
    // Database connection establish karo
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_patientcategory(:retval); END;`,
      {
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "Patient categories fetched successfully",
    });
  } catch (error) {
    console.error("Error in getPatientCategory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient categories",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

const getAllConsultantByOpdCategory = async (req, res) => {

  const facultyId = req?.query.facultyId;

  let connection;

  try {
    // Database connection establish karo
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_consultant(:facultyId , :retval); END;`,
      {
        facultyId: facultyId || null,
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "All Consultant fetched successfully",
    });
  } 
  catch (error) {
    console.error("Error in fetched All Consultant:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Consultant",
      error: error.message,
    });
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
  
};

const getReference = async (req, res) => {

  const patientTypeId = req?.params.patientid;

  if (!patientTypeId) {
    return res.status(400).json({
      success: false,
      message: "patientid is required",
    });
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_reference( vpatientid => :patientTypeId , retval => :retval); END;`,
      {
        patientTypeId: patientTypeId,
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "Reference fetched successfully",
    });
  } 
  catch (error) {
    console.error("Error in getReference:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reference",
      error: error.message,
    });
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

module.exports = {
  getOpdCategory,
  getPatientCategory,
  getAllConsultantByOpdCategory,
  getReference,
};

const oracledb = require("oracledb");
const poolPromise = require("../database.js");

 const addOrEditFaculty = async (req, res) => {
  const { id, name, user } = req.body;
  if (!name)
    return res.status(400).json({ success: false, message: "Consultant name is required" });

  let connection;
  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const { outBinds } = await connection.execute(
      `BEGIN add_edit_faculty(:p_id, :p_name, :p_user, :p_status); END;`,
      {
        p_id: id || null, 
        p_name: name,
        p_user: user || "Admin",
        p_status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    const status = outBinds.p_status;

    res.status(status === 1 ? 200 : 400).json({
      success: status === 1,
      message:
        status === 1
          ? id
            ? "Consultant updated successfully"
            : "Consultant added successfully"
          : id
          ? "Consultant not found or update failed"
          : "Consultant to add faculty",
    });
  } catch (err) {
    console.error(" addOrEditFaculty Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
};



// ---------   GET


 const getAllFaculty = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN
         get_all_faculty(:p_result);
       END;`,
      {
        p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT } 
    );

    const resultSet = result.outBinds.p_result;
    const rows = await resultSet.getRows(); 
    await resultSet.close();

     res.status(200).json({
        success: true,
        data: rows,
      });

  } catch (err) {
    console.error(" Error fetching faculty:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
};


// --- Delete (Soft Delete)
 const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Faculty ID is required",
    });
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        delete_faculty(:p_id, :p_status);
      END;
      `,
      {
        p_id: id, 
        p_status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    const { p_status } = result.outBinds;

    if (p_status === 1) {
      return res.status(200).json({
        success: true,
        message: "Faculty deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Faculty not found ",
      });
    }
  } catch (err) {
    console.error("Error deleting faculty:", err);
    return res.status(500).json({
      success: false,
      message: "Database error while deleting faculty",
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
};

module.exports = { addOrEditFaculty, getAllFaculty, deleteFaculty };
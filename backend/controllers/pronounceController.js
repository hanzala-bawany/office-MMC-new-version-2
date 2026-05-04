// controllers/pronounceController.js

const oracledb    = require("oracledb");
const poolPromise = require("../database.js");

// GET
const getConsultantPronounce = async (req, res) => {
  let connection;
  try {
    const { consultantId } = req.query;

    const pool = await poolPromise;
    connection  = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN
         get_consultant_pronounce(:id, :cursor);
       END;`,
      {
        id:     consultantId ? Number(consultantId) : null,
        cursor: { 
          dir:  oracledb.BIND_OUT, 
          type: oracledb.CURSOR 
        },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rs   = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    res.status(200).json({
      success: true,
      count:   rows.length,
      data:    rows,
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error:   err.message 
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

// POST — Add/Edit/Delete
const manageConsultantPronounce = async (req, res) => {
  let connection;
  try {
    const { action, consultantId, pronounceName, user } = req.body;

    if (!consultantId) {
      return res.status(400).json({
        success: false,
        message: "consultantId required",
      });
    }

    const pool = await poolPromise;
    connection  = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN
         manage_consultant_pronounce(
           :action,
           :consultant_id,
           :pronounce,
           :user,
           :status
         );
       END;`,
      {
        action:        (action || "ADD").toUpperCase(),
        consultant_id: Number(consultantId),
        pronounce:     pronounceName || null,
        user:          user || "Admin",
        status: { 
          dir:  oracledb.BIND_OUT, 
          type: oracledb.NUMBER 
        },
      },
      { autoCommit: true }
    );

    const status = result.outBinds.status;

    res.status(status === 1 ? 200 : 400).json({
      success: status === 1,
      message: status === 1
        ? action === "DELETE"
          ? "Pronounce name deleted"
          : "Pronounce name saved successfully"
        : "Operation failed",
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error:   err.message 
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = { 
  getConsultantPronounce, 
  manageConsultantPronounce 
};
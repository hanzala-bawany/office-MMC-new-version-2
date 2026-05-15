const oracledb = require("oracledb");
const poolPromise = require("../database.js");



// ------- PATIENT LOGIN API ------------------
const patientLogin = async (req, res) => {
  let connection;

  try {
    const { mrno, contactno } = req.body;

    if (!mrno || !contactno) {
      return res.status(400).json({
        success: false,
        message: "mrno and contactno are required",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        patient_login(
          p_mrno      => :mrno,
          p_contactno => :contactno,
          p_status    => :status,
          p_message   => :message,
          retval      => :retval
        );
      END;
      `,
      {
        mrno:      mrno.trim(),
        contactno: contactno.trim(),
        status:    { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        message:   { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 200 },
        retval:    { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const status  = result.outBinds.status;
    const message = result.outBinds.message;
    const cursor  = result.outBinds.retval;
    const rows    = await cursor.getRows();
    await cursor.close();

    if (status === 0) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (status === -1) {
      return res.status(500).json({
        success: false,
        message,
      });
    }

    res.json({
      success: true,
      message,
      data: rows[0] ?? null,
    });

  } catch (err) {
    console.error("patientLogin error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to login patient",
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


module.exports = { patientLogin };

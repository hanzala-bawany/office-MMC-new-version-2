const oracledb = require("oracledb");
const poolPromise = require("../database.js");

// Check how many unique patients are registered with the given contact number

const patientLogin = async (req, res) => {
  let connection;

  try {
    const { contactno } = req.body;

    if (!contactno) {
      return res.status(400).json({
        success: false,
        message: "Contact number is required",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      BEGIN
        patient_login(
          p_contactno => :contactno,
          p_status    => :status,
          p_message   => :message,
          retval      => :retval
        );
      END;
      `,
      {
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
      return res.status(404).json({ success: false, message });
    }

    if (status === -1) {
      return res.status(500).json({ success: false, message });
    }

    res.json({
      success: true,
      message,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error("patientLogin error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};






// patient login

const patientLoginMrno = async (req, res) => {
  let connection;
  try {
    const { contactno, mrno } = req.body;

    if (!contactno || !mrno) {
      return res.status(400).json({ 
        success: false, 
        message: "contactno aur mrno dono required hain" 
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN
        patient_login_mrno(
          p_contactno => :contactno,
          p_mrno      => :mrno,
          p_status    => :status,
          p_message   => :message,
          retval      => :retval
        );
       END;`,
      {
        contactno: contactno.trim(),
        mrno:      mrno.trim(),
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

    if (status === 0) return res.status(404).json({ success: false, message });
    if (status === -1) return res.status(500).json({ success: false, message });

    res.json({
      success: true,
      message,
      patient: rows[0]
    });

  } catch (err) {
    console.error("patientLoginMrno error:", err);
    res.status(500).json({ success: false, message: "Failed", error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = { patientLogin, patientLoginMrno };




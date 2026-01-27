const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const poolPromise = require("../database.js");

const unifiedLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // ================== 1️⃣ TRY USER LOGIN ==================
    const userResult = await connection.execute(
      `
      BEGIN
        user_login1(
          :username,
          :password,
          :status,
          :message,
          :userrole
        );
      END;
      `,
      {
        username,
        password,
        status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        message: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        userrole: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const { status, message, userrole } = userResult.outBinds;

    // ✅ Admin / Screen success
    if (status === 1) {
      const role =
        userrole === 1 ? "admin" : "screen";

      const token = jwt.sign(
        { username, role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message,
        role,
        token
      });
    }

    // ================== 2️⃣ TRY DOCTOR LOGIN ==================
    const doctorResult = await connection.execute(
      `
      BEGIN
        get_doctor_login(
          :username,
          :password,
          :cursor
        );
      END;
      `,
      {
        username,
        password,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const rs = doctorResult.outBinds.cursor;
    const rows = await rs.getRows(1);
    await rs.close();

    if (rows.length > 0) {
      const doctor = rows[0];

      const token = jwt.sign(
        {
          doctorId: doctor.ID,
          name: doctor.NAME,
          role: "doctor"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Doctor login successful",
        role: "doctor",
        doctorId: doctor.ID,
        doctorName: doctor.NAME,
        token
      });
    }

    // ❌ Both failed
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });

  } catch (err) {
    console.error("Unified Login Error:", err);
    return res.status(500).json({
      success: false,
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

module.exports = { unifiedLogin };

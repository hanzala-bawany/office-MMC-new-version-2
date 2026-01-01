const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const fs = require("fs");
const path = require("path");

// ----------------- ASSETS FOLDER -----------------
const doctorAssetDir = path.join(__dirname, "../assets/doctor");
if (!fs.existsSync(doctorAssetDir)) {
  fs.mkdirSync(doctorAssetDir, { recursive: true });
}

// ----------------- HELPER: GET OLD IMAGE -----------------
const getDoctorImageById = async (connection, doctorId) => {
  const result = await connection.execute(
    `SELECT image_path FROM doctorinfo WHERE fk_docid = :id`,
    { id: doctorId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  return result.rows.length ? result.rows[0].IMAGE_PATH : null;
};

// ----------------- MANAGE DOCTOR -----------------
const manageDoctor = async (req, res) => {
  const file = req?.file || null;
  const body = req.body || {};

  let {
    action, id, doctor_name, contactno, email, gender, address,
    description, fkfaculty_id, fees, days, createdby, editby,
    status, roomname
  } = body;

  let connection;
  let oldImagePath = null;
  let imagePath = null;

  try {
    const finalAction = (action || "").trim().toUpperCase();
    const validActions = ["ADD", "EDIT", "DELETE"];

    if (!validActions.includes(finalAction))
      return res.status(400).json({ success: false, message: "Invalid action" });

    if ((finalAction === "EDIT" || finalAction === "DELETE") && !id)
      return res.status(400).json({ success: false, message: "ID required" });

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // 🔹 GET OLD IMAGE
    if (finalAction !== "ADD") {
      oldImagePath = await getDoctorImageById(connection, id);
      imagePath = oldImagePath; // default path
    }

    // ---------------- IMAGE HANDLING ----------------
    if (file && (finalAction === "ADD" || finalAction === "EDIT")) {
      const ext = path.extname(file.originalname);
      let filename;

      if (finalAction === "ADD") {
        // ADD → unique file
        filename = `doctor_${Date.now()}${ext}`;
      } else {
        // EDIT → overwrite old file (same filename)
        if (oldImagePath) {
          const oldFullPath = path.join(doctorAssetDir, path.basename(oldImagePath));
          if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);

          filename = path.basename(oldImagePath); // same name
        } else {
          // EDIT but no previous image → create based on ID
          filename = `doctor_${id}${ext}`;
        }
      }

      const savePath = path.join(doctorAssetDir, filename);
      fs.writeFileSync(savePath, file.buffer); // overwrite if EDIT

      imagePath = `doctor/${filename}`; // DB path fixed
    }

    // ---------------- DEFAULT VALUES ----------------
    // fees = fees ? Number(fees) : 0;
    // status = status ? Number(status) : 1;
    // roomname = roomname || "Room not assigned yet";
    // description = description || "Consultation details will be updated soon.";
    // email = email || "abc@gmail.com";
    // address = address || "Not yet";
    // createdby = createdby || "Admin";
    // editby = editby || "Admin";

    fees = fees !== undefined && fees !== null && fees !== "" && fees !== "undefined" ? Number(fees) : 0;
    status = status !== undefined && status !== null && status !== "" && status !== "undefined" ? Number(status) : null;
    roomname = roomname !== undefined && roomname !== null && roomname !== "" && roomname !== "undefined" ? roomname : "Room not assigned yet";
    description = description !== undefined && description !== null && description !== "" && description !== "undefined" ? description : "Consultation details will be updated soon.";
    email = email !== undefined && email !== null && email !== "" && email !== "undefined" ? email : "abc@gmail.com";
    address = address !== undefined && address !== null && address !== "" && address !== "undefined" ? address : "Not yet";


    // ---------------- DELETE ----------------
    if (finalAction === "DELETE" && oldImagePath) {
      const oldFullPath = path.join(doctorAssetDir, path.basename(oldImagePath));
      if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
      imagePath = null; // optional: clear DB reference
      status = 9;       // force soft delete
    }

    // ---------------- DB CALL ----------------
    await connection.execute(
      `
      BEGIN
        manage_doctor(
          p_action        => :action,
          p_id            => :id,
          p_doctor_name   => :doctor_name,
          p_contactno     => :contactno,
          p_email         => :email,
          p_gender        => :gender,
          p_address       => :address,
          p_description   => :description,
          p_image_path    => :image_path,
          p_fkfaculty_id  => :fkfaculty_id,
          p_fees          => :fees,
          p_days          => :days,
          p_createdby     => :createdby,
          p_editby        => :editby,
          p_status        => :status,
          p_roomname      => :roomname
        );
      END;
      `,
      {
        action,
        id,
        doctor_name,
        contactno,
        email,
        gender,
        address,
        description,
        image_path: imagePath,
        fkfaculty_id,
        fees,
        days,
        createdby,
        editby,
        status,
        roomname
      },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message:
        finalAction === "ADD"
          ? "Doctor added successfully"
          : finalAction === "EDIT"
          ? "Doctor updated successfully"
          : "Doctor deleted successfully"
    });

  } catch (err) {
    console.error("Error in manageDoctor:", err);
    if (connection) await connection.rollback().catch(() => {});
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};



// ----------------- GET DOCTORS -----------------
const getDoctors = async (req, res) => {
  const { id, status = "1", faculty_id } = req.query;
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      DECLARE
        v_cursor SYS_REFCURSOR;
      BEGIN
        get_doctors(
          p_id          => :id,
          p_status      => :status,
          p_faculty_id  => :faculty_id,
          p_result      => v_cursor
        );
        :cursor := v_cursor;
      END;
      `,
      {
        id: id || null,
        status: status || null,
        faculty_id: faculty_id || null,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.cursor;
    const rows = [];
    const fetchSize = 100;
    let fetchRows;

    do {
      fetchRows = await resultSet.getRows(fetchSize);
      for (let row of fetchRows) {
        row.IMAGE_URL = row.IMAGE_PATH
          ? `/assets/${row.IMAGE_PATH}`
          : `/assets/default.png`;
      }
      rows.push(...fetchRows);
    } while (fetchRows.length === fetchSize);

    await resultSet.close();

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully.",
      count: rows.length,
      data: rows,
    });

  } catch (err) {
    console.error("Error in getDoctors:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = { manageDoctor, getDoctors };

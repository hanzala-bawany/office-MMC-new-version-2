const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");



const manageDoctor = async (req, res) => {
  const file = req?.file || null;
  const byDefault = req?.body?.image || null;

  console.log(req.body, "<<<<<< req.body");

  const body = req.body || {};
  let {
    action,
    id,
    doctor_name,
    contactno,
    email,
    gender,
    address,
    description,
    fkfaculty_id,
    fees,
    days,
    createdby,
    editby,
    status,
    roomname,
  } = body;

  let connection;

  try {
    const finalAction = (action || "").trim().toUpperCase();
    const validActions = ["ADD", "EDIT", "DELETE"];

    if (!validActions.includes(finalAction)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Only ADD / EDIT / DELETE allowed.",
      });
    }

    if ((finalAction === "EDIT" || finalAction === "DELETE") && !id) {
      return res.status(400).json({
        success: false,
        message: "ID required for EDIT or DELETE.",
      });
    }

    // 🔥 Screen-3 rule: ADD → Image required, EDIT → optional
    let imageBlob = null;
    if (file && (finalAction === "ADD" || finalAction === "EDIT")) {
      imageBlob = file.buffer;
    }
    else if (!file && byDefault) {
      try {
        const imgPath = path.join(__dirname, "../assets", byDefault);
        // Read as buffer
        imageBlob = fs.readFileSync(imgPath);
      } catch (e) {
        console.log("Default image load error:", e);
        imageBlob = null;
      }
    }



    // Number safe conversio
    fees = fees !== undefined && fees !== null && fees !== "" && fees !== "undefined" ? Number(fees) : 0;
    status = status !== undefined && status !== null && status !== "" && status !== "undefined" ? Number(status) : null;
    roomname = roomname !== undefined && roomname !== null && roomname !== "" && roomname !== "undefined" ? roomname : "Room not assigned yet";
    description = description !== undefined && description !== null && description !== "" && description !== "undefined" ? description : "Consultation details will be updated soon.";
    email = email !== undefined && email !== null && email !== "" && email !== "undefined" ? email : "abc@gmail.com";
    address = address !== undefined && address !== null && address !== "" && address !== "undefined" ? address : "Not yet";


    const pool = await poolPromise;
    connection = await pool.getConnection();

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
          p_image         => :image,
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
        action: { val: finalAction, type: oracledb.STRING },
        id: id ? { val: id, type: oracledb.STRING } : { val: null, type: oracledb.STRING },

        doctor_name: { val: doctor_name || null, type: oracledb.STRING },
        contactno: { val: contactno || null, type: oracledb.STRING },
        email: { val: email || null, type: oracledb.STRING },
        gender: { val: gender || null, type: oracledb.STRING },
        address: { val: address || null, type: oracledb.STRING },
        description: { val: description || null, type: oracledb.STRING },

        // 🔥 PURE SCREEN-3 STYLE BLOB HANDLING
        image: imageBlob
          ? { val: imageBlob, type: oracledb.BLOB }
          : { val: null, type: oracledb.BLOB },

        fkfaculty_id: { val: fkfaculty_id || null, type: oracledb.STRING },
        fees: fees !== null ? { val: fees, type: oracledb.NUMBER } : { val: null, type: oracledb.NUMBER },
        days: { val: days || null, type: oracledb.STRING },
        createdby: { val: createdby || "Admin", type: oracledb.STRING },
        editby: { val: editby || "Admin", type: oracledb.STRING },
        status: status !== null ? { val: status, type: oracledb.NUMBER } : { val: null, type: oracledb.NUMBER },
        roomname: { val: roomname || null, type: oracledb.STRING },
      },
      { autoCommit: false }
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message:
        finalAction === "ADD"
          ? "Doctor added successfully."
          : finalAction === "EDIT"
            ? "Doctor updated successfully."
            : "Doctor deleted successfully.",
    });
  } catch (err) {
    console.error("Error in manageDoctor:", err);
    if (connection) await connection.rollback().catch(() => { });
    res.status(500).json({
      success: false,
      message: `Currently Unavailable --> ${err}`,
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => { });
  }
};



const multer = require("multer");

const uploadCSV = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") cb(null, true);
    else cb(new Error("Only CSV files allowed"));
  },
});



const uploadDoctorsCSV = async (req, res) => {
  const file = req.file;
  let connection;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "CSV file is required",
    });
  }

  const doctors = [];

  try {
    // 🔹 Parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => doctors.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    if (!doctors.length) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    let successCount = 0;
    let failed = [];

    for (let i = 0; i < doctors.length; i++) {
      const d = doctors[i];

      try {
        const defaultImage =
          d.gender === "Female" ? "femaleDoctor.png" : "maleDoctor.png";

        const imgPath = path.join(__dirname, "../assets", defaultImage);
        const imageBlob = fs.readFileSync(imgPath);

        await connection.execute(
          `
          BEGIN
            manage_doctor(
              p_action        => 'ADD',
              p_id            => NULL,
              p_doctor_name   => :doctor_name,
              p_contactno     => :contactno,
              p_email         => :email,
              p_gender        => :gender,
              p_address       => :address,
              p_description   => :description,
              p_image         => :image,
              p_fkfaculty_id  => :fkfaculty_id,
              p_fees          => :fees,
              p_days          => :days,
              p_createdby     => 'Admin',
              p_editby        => 'Admin',
              p_status        => :status,
              p_roomname      => :roomname
            );
          END;
          `,
          {
            doctor_name: d.doctor_name,
            contactno: d.contactno || null,
            email: d.email || "abc@gmail.com",
            gender: d.gender,
            address: d.address || "Not yet",
            description: d.description || "Consultation details will be updated soon.",
            image: { val: imageBlob, type: oracledb.BLOB },
            fkfaculty_id: d.fkfaculty_id,
            fees: Number(d.fees) || 0,
            days: d.days || null,
            status: Number(d.status) || 1,
            roomname: d.roomname || "Room not assigned yet",
          },
          { autoCommit: false }
        );

        successCount++;
      } catch (rowErr) {
        failed.push({
          row: i + 1,
          doctor_name: d.doctor_name,
          error: rowErr.message,
        });
      }
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "CSV processed",
      total: doctors.length,
      inserted: successCount,
      failed,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("CSV Upload Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to upload CSV",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => {});
    fs.unlinkSync(file.path); // delete uploaded CSV
  }
};





//-------GET----------------
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
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.cursor;
    const rows = [];
    let fetchRows;
    const fetchSize = 100;

    do {
      fetchRows = await resultSet.getRows(fetchSize);
      for (let row of fetchRows) {
        if (row.IMAGE) {
          const lob = row.IMAGE;
          const chunks = [];
          await new Promise((resolve, reject) => {
            lob.on("data", (chunk) => chunks.push(chunk));
            lob.on("end", resolve);
            lob.on("error", reject);
          });
          const buffer = Buffer.concat(chunks);
          row.IMAGE = `data:image/png;base64,${buffer.toString("base64")}`;
        }
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
    console.error("❌ Error in getDoctors:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close().catch(() => { });
  }
};

module.exports = { manageDoctor, getDoctors, uploadCSV, uploadDoctorsCSV };
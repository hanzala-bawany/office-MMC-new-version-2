const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const fs = require("fs");
const path = require("path");

// ----------------- ASSETS FOLDER -----------------
const doctorAssetDir = path.join(process.cwd(), "assets", "doctor");

if (!fs.existsSync(doctorAssetDir)) {
  fs.mkdirSync(doctorAssetDir, { recursive: true });
}

// ----------------- HELPER: GET OLD IMAGE -----------------
const getDoctorImageById = async (connection, doctorId) => {
  const result = await connection.execute(
    `SELECT image_path FROM doctorinfo WHERE fk_docid = :id`,
    { id: doctorId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );
  return result.rows.length ? result.rows[0].IMAGE_PATH : null;
};

// ----------------- MANAGE DOCTOR -----------------
const manageDoctor = async (req, res) => {
  const file = req?.file || null;
  const body = req.body || {};
  const defaultImageName =
    !file && body.image && typeof body.image === "string" ? body.image : null;

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
  let oldImagePath = null;
  let imagePath = null;

  try {
    const finalAction = (action || "").trim().toUpperCase();
    const validActions = ["ADD", "EDIT", "DELETE"];

    if (!validActions.includes(finalAction))
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });

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
    // if (file && (finalAction === "ADD" || finalAction === "EDIT")) {
    //   const ext = path.extname(file.originalname);
    //   let filename;

    //   if (finalAction === "ADD") {
    //     // ADD → unique file
    //     filename = `doctor_${Date.now()}${ext}`;
    //   } else {
    //     // EDIT → overwrite old file (same filename)
    //     if (oldImagePath) {
    //       const oldFullPath = path.join(doctorAssetDir, path.basename(oldImagePath));
    //       if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);

    //       filename = path.basename(oldImagePath); // same name
    //     } else {
    //       // EDIT but no previous image → create based on ID
    //       filename = `doctor_${id}${ext}`;
    //     }
    //   }

    //   const savePath = path.join(doctorAssetDir, filename);
    //   fs.writeFileSync(savePath, file.buffer); // overwrite if EDIT

    //   imagePath = `doctor/${filename}`; // DB path fixed
    // }

    // ---------------- IMAGE HANDLING ----------------
    if (finalAction === "ADD" || finalAction === "EDIT") {
      // ✅ CASE 1: User uploaded image
      if (file) {
        const ext = path.extname(file.originalname);
        const filename =
          finalAction === "ADD"
            ? `doctor_${Date.now()}${ext}`
            : oldImagePath
              ? path.basename(oldImagePath)
              : `doctor_${id}${ext}`;

        const savePath = path.join(doctorAssetDir, filename);
        fs.writeFileSync(savePath, file.buffer);

        imagePath = `doctor/${filename}`;
      }

      // ✅ CASE 2: NO upload → use DEFAULT image
      else if (defaultImageName) {
        const defaultPath = path.join(__dirname, "../assets", defaultImageName);

        if (fs.existsSync(defaultPath)) {
          const ext = path.extname(defaultImageName);
          const filename =
            finalAction === "ADD"
              ? `doctor_${Date.now()}${ext}`
              : oldImagePath
                ? path.basename(oldImagePath)
                : `doctor_${id}${ext}`;

          const savePath = path.join(doctorAssetDir, filename);
          fs.copyFileSync(defaultPath, savePath);

          imagePath = `doctor/${filename}`;
        }
      }

      // ❗ CASE 3: EDIT without image → keep old
      else {
        imagePath = oldImagePath;
      }
    }

    fees =
      fees !== undefined && fees !== null && fees !== "" && fees !== "undefined"
        ? Number(fees)
        : 0;
    status =
      status !== undefined &&
      status !== null &&
      status !== "" &&
      status !== "undefined"
        ? Number(status)
        : null;
    roomname =
      roomname !== undefined &&
      roomname !== null &&
      roomname !== "" &&
      roomname !== "undefined"
        ? roomname
        : "Room not assigned yet";
    description =
      description !== undefined &&
      description !== null &&
      description !== "" &&
      description !== "undefined"
        ? description
        : "Consultation details will be updated soon.";
    email =
      email !== undefined &&
      email !== null &&
      email !== "" &&
      email !== "undefined"
        ? email
        : "abc@gmail.com";
    address =
      address !== undefined &&
      address !== null &&
      address !== "" &&
      address !== "undefined"
        ? address
        : "Not yet";

    // ---------------- DELETE ----------------
    if (finalAction === "DELETE" && oldImagePath) {
      const oldFullPath = path.join(
        doctorAssetDir,
        path.basename(oldImagePath),
      );
      if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
      imagePath = null; // optional: clear DB reference
      status = 9; // force soft delete
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
        roomname,
      },
      { autoCommit: true },
    );

    res.json({
      success: true,
      message:
        finalAction === "ADD"
          ? "Doctor added successfully"
          : finalAction === "EDIT"
            ? "Doctor updated successfully"
            : "Doctor deleted successfully",
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
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const resultSet = result.outBinds.cursor;
    const rows = [];
    const fetchSize = 100;
    let fetchRows;

    do {
      fetchRows = await resultSet.getRows(fetchSize);
      for (let row of fetchRows) {
        row.IMAGE = row.IMAGE_PATH
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



// const getDoctorReport = async (req, res) => {
//   let { doctorId, fromDate, toDate } = req.query;

//   // Validation
//   if (!doctorId) {
//     return res.status(400).json({
//       success: false,
//       message: "doctorId is required",
//     });
//   }

//   if (!fromDate) {
//     return res.status(400).json({
//       success: false,
//       message: "fromDate is required",
//     });
//   }

//   if (!toDate) {
//     toDate = fromDate;
//   }

//   let connection;

//   try {
//     const pool = await poolPromise;
//     connection = await pool.getConnection();

//     const result = await connection.execute(
//       `
//       DECLARE
//         v_cursor SYS_REFCURSOR;
//       BEGIN
//         get_doctor_report1(
//           p_doc_id   => :doc_id,
//           p_fromdate => :from_date,
//           p_todate   => :to_date,
//           p_result   => v_cursor
//         );
//         :cursor := v_cursor;
//       END;
//       `,
//       {
//         doc_id: Number(doctorId),
//         from_date: new Date(fromDate),
//         to_date: new Date(toDate),
//         cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//       },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT },
//     );

//     const rs = result.outBinds.cursor;
//     const rows = await rs.getRows();
//     await rs.close();

//     const raw = rows[0] || {};

//     const report = {
//       period: {
//         fromDate: fromDate,
//         toDate: toDate,
//       },
//       consultant: {
//         id: Number(doctorId),
//         name: raw.CONSULTANT_NAME || "",
//         degrees: raw.DEGREES || "",
//         faculty: raw.FACULTY || "",
//       },
//       summary: {
//         total_patients: raw.TOTAL_PATIENTS || 0,
//         total_gross: raw.TOTAL_GROSS || 0,
//         total_discount: raw.TOTAL_DISCOUNT || 0,
//         total_revenue: raw.TOTAL_REVENUE || 0,
//         male: raw.MALE_COUNT || 0,
//         female: raw.FEMALE_COUNT || 0,
//         checked: raw.CHECKED || 0,
//         remaining: raw.REMAINING || 0,
//         skipped: raw.SKIPPED || 0,
//         cancelled: raw.CANCELLED || 0,
//       },
//       demographics: {
//         gender: {
//           male: raw.MALE_COUNT || 0,
//           female: raw.FEMALE_COUNT || 0,
//         },
//         age_groups: {
//           infant: raw.AGE_INFANT || 0,
//           child: raw.AGE_CHILD || 0,
//           young: raw.AGE_YOUNG || 0,
//           adult: raw.AGE_ADULT || 0,
//           senior: raw.AGE_SENIOR || 0,
//         },
//         patients: {
//           new: raw.NEW_PATIENTS || 0,
//           returning: raw.RETURNING_PATIENTS || 0,
//         },
//       },
//       // NOTE: opdreceipt.patienttype is a funding CATEGORY (PUBLIC/ZAKAT/BMJ/SPD),
//       // not an outdoor/indoor flag. This whole table is OPD (outdoor) scope,
//       // so every category shares the single consultantshareoutdoor rate.
//       // See get_doctor_report1 procedure header for full reasoning.
//       revenue_split: {
//         public: {
//           patients: raw.PUBLIC_PATIENTS || 0,
//           revenue: raw.PUBLIC_REVENUE || 0,
//         },
//         zakat: {
//           patients: raw.ZAKAT_PATIENTS || 0,
//           revenue: raw.ZAKAT_REVENUE || 0,
//         },
//         bmj: {
//           patients: raw.BMJ_PATIENTS || 0,
//           revenue: raw.BMJ_REVENUE || 0,
//         },
//         spd: {
//           patients: raw.SPD_PATIENTS || 0,
//           revenue: raw.SPD_REVENUE || 0,
//         },
//         other: {
//           patients: raw.OTHER_PATIENTS || 0,
//           revenue: raw.OTHER_REVENUE || 0,
//         },
//         share_percent: raw.CONSULTANTSHAREOUTDOOR || 0,
//         surgery_charges: raw.SURGERYCHARGES || 0,
//         anesthesia_charges: raw.ANESCHARGES || 0,
//         total_consultant_earning: raw.TOTAL_CONSULTANT_EARNING || 0,
//       },
//     };

//     res.status(200).json({ success: true, data: report });
//   } catch (err) {
//     console.error("getDoctorRangeReport error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   } finally {
//     if (connection) await connection.close().catch(() => {});
//   }
// };

const getDoctorReport = async (req, res) => {
  let { doctorId, fromDate, toDate } = req.query;

  // ✅ Validation
  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "doctorId is required",
    });
  }

  if (!fromDate) {
    return res.status(400).json({
      success: false,
      message: "fromDate is required",
    });
  }

  // ✅ Agar toDate nahi hai toh fromDate use karo
  if (!toDate) {
    toDate = fromDate;
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // ✅ Execute procedure
    const result = await connection.execute(
      `
      DECLARE
        v_cursor SYS_REFCURSOR;
      BEGIN
        get_doctor_report(
          p_doc_id   => :doc_id,
          p_fromdate => :from_date,
          p_todate   => :to_date,
          p_result   => v_cursor
        );
        :cursor := v_cursor;
      END;
      `,
      {
        doc_id: Number(doctorId),
        from_date: new Date(fromDate),
        to_date: new Date(toDate),
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    // ✅ Check if data exists
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the given criteria",
      });
    }

    // ✅ Separate OPD and IPD data
    const opdData = rows.find((row) => row.RECEIPTTYPE === "OPD") || {};
    const ipdData = rows.find((row) => row.RECEIPTTYPE === "IPD") || {};

    // ✅ Extract consultant info from first row
    const firstRow = rows[0] || {};

    // ✅ Build report response
    const report = {
      period: {
        fromDate: fromDate,
        toDate: toDate,
      },
      consultant: {
        id: Number(doctorId),
        name: firstRow.NAME || "",
        degrees: firstRow.DEGREES || "",
        faculty: firstRow.FACULTY || "",
        hospitalRate: firstRow.HOSPITALRATE || 0,
      },
      summary: {
        total_patients:
          (opdData.TOTAL_PATIENT || 0) + (ipdData.TOTAL_PATIENT || 0),
        total_gross: (opdData.GROSS || 0) + (ipdData.GROSS || 0),
        total_discount: (opdData.DISCOUNT || 0) + (ipdData.DISCOUNT || 0),
        total_revenue: (opdData.NET || 0) + (ipdData.NET || 0),
        total_consultant_share:
          (opdData.COUNSULTANTSHARE || 0) + (ipdData.COUNSULTANTSHARE || 0),
        total_hospital_share:
          (opdData.HOSPITALSHARE || 0) + (ipdData.HOSPITALSHARE || 0),
      },
      opd: {
        patients: opdData.TOTAL_PATIENT || 0,
        gross: opdData.GROSS || 0,
        discount: opdData.DISCOUNT || 0,
        net: opdData.NET || 0,
        consultant_share_percent: opdData.CONSULTANTSHARE || 0,
        hospital_share_percent: opdData.HOSPITALSHARE || 0,
        consultant_share: opdData.COUNSULTANTSHARE || 0,
        hospital_share: opdData.HOSPITALSHARE || 0,
        total_charges: opdData.TOTAL_CHARGES || 0,
        net_after_charges: opdData.NETAMTAFTERCHARGES || 0,
        patient_status: {
          checked: opdData.CHECKED || 0,
          remaining: opdData.REMAINING || 0,
          skipped: opdData.SKIPPED || 0,
          cancelled: opdData.CANCELLED || 0,
        },
        patient_type: {
          public: opdData.PUBLIC_PATIENT || 0,
          zakat: opdData.ZAKAT_PATIENT || 0,
          bmj: opdData.BMJ_PATIENT || 0,
          spd: opdData.SPD_PATIENT || 0,
        },
        demographics: {
          gender: {
            male: opdData.MALE_PATIENT || 0,
            female: opdData.FEMALE_PATIENT || 0,
          },
          age_groups: {
            infant: opdData.INFATE || 0,
            child: opdData.CHILD || 0,
            teen: opdData.TEEN || 0,
            adult: opdData.ADULT || 0,
            senior: opdData.SENIOR || 0,
          },
        },
      },
      ipd: {
        patients: ipdData.TOTAL_PATIENT || 0,
        gross: ipdData.GROSS || 0,
        discount: ipdData.DISCOUNT || 0,
        net: ipdData.NET || 0,
        consultant_share_percent: ipdData.CONSULTANTSHARE || 0,
        hospital_share_percent: ipdData.HOSPITALSHARE || 0,
        consultant_share: ipdData.COUNSULTANTSHARE || 0,
        hospital_share: ipdData.HOSPITALSHARE || 0,
        total_charges: ipdData.TOTAL_CHARGES || 0,
        net_after_charges: ipdData.NETAMTAFTERCHARGES || 0,
        patient_type: {
          public: ipdData.PUBLIC_PATIENT || 0,
          zakat: ipdData.ZAKAT_PATIENT || 0,
          bmj: ipdData.BMJ_PATIENT || 0,
          spd: ipdData.SPD_PATIENT || 0,
        },
        demographics: {
          gender: {
            male: ipdData.MALE_PATIENT || 0,
            female: ipdData.FEMALE_PATIENT || 0,
          },
          age_groups: {
            infant: ipdData.INFATE || 0,
            child: ipdData.CHILD || 0,
            teen: ipdData.TEEN || 0,
            adult: ipdData.ADULT || 0,
            senior: ipdData.SENIOR || 0,
          },
        },
      },
      combined_demographics: {
        gender: {
          male: (opdData.MALE_PATIENT || 0) + (ipdData.MALE_PATIENT || 0),
          female: (opdData.FEMALE_PATIENT || 0) + (ipdData.FEMALE_PATIENT || 0),
        },
        age_groups: {
          infant: (opdData.INFATE || 0) + (ipdData.INFATE || 0),
          child: (opdData.CHILD || 0) + (ipdData.CHILD || 0),
          teen: (opdData.TEEN || 0) + (ipdData.TEEN || 0),
          adult: (opdData.ADULT || 0) + (ipdData.ADULT || 0),
          senior: (opdData.SENIOR || 0) + (ipdData.SENIOR || 0),
        },
      },
      combined_patient_types: {
        public: (opdData.PUBLIC_PATIENT || 0) + (ipdData.PUBLIC_PATIENT || 0),
        zakat: (opdData.ZAKAT_PATIENT || 0) + (ipdData.ZAKAT_PATIENT || 0),
        bmj: (opdData.BMJ_PATIENT || 0) + (ipdData.BMJ_PATIENT || 0),
        spd: (opdData.SPD_PATIENT || 0) + (ipdData.SPD_PATIENT || 0),
      },
    };

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  } catch (err) {
    console.error("getDoctorReport error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
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


// const getDoctorReport = async (req, res) => {
//   let { doctorId, fromDate, toDate } = req.query;

//   // Validation
//   if (!doctorId) {
//     return res.status(400).json({
//       success: false,
//       message: "doctorId is required",
//     });
//   }

//   if (!fromDate) {
//     return res.status(400).json({
//       success: false,
//       message: "fromDate is required",
//     });
//   }

//   if (!toDate) {
//     toDate = fromDate;
//   }

//   let connection;

//   try {
//     const pool = await poolPromise;
//     connection = await pool.getConnection();

//     const result = await connection.execute(
//       `
//       DECLARE
//         v_cursor SYS_REFCURSOR;
//       BEGIN
//         get_doctor_report(
//           p_doc_id   => :doc_id,
//           p_fromdate => :from_date,
//           p_todate   => :to_date,
//           p_result   => v_cursor
//         );
//         :cursor := v_cursor;
//       END;
//       `,
//       {
//         doc_id: Number(doctorId),
//         from_date: new Date(fromDate),
//         to_date: new Date(toDate),
//         cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//       },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT },
//     );

//     const rs = result.outBinds.cursor;
//     const rows = await rs.getRows();
//     await rs.close();

//     const raw = rows[0] || {};

//     const report = {
//       period: {
//         fromDate: fromDate,
//         toDate: toDate,
//       },
//       consultant: {
//         id: Number(doctorId),
//         name: raw.CONSULTANT_NAME || "",
//         degrees: raw.DEGREES || "",
//         faculty: raw.FACULTY || "",
//       },
//       summary: {
//         total_patients: raw.TOTAL_PATIENTS || 0,
//         total_gross: raw.TOTAL_GROSS || 0,
//         total_discount: raw.TOTAL_DISCOUNT || 0,
//         total_revenue: raw.TOTAL_REVENUE || 0,
//         male: raw.MALE_COUNT || 0,
//         female: raw.FEMALE_COUNT || 0,
//         checked: raw.CHECKED || 0,
//         remaining: raw.REMAINING || 0,
//         skipped: raw.SKIPPED || 0,
//         cancelled: raw.CANCELLED || 0,
//       },
//       demographics: {
//         gender: {
//           male: raw.MALE_COUNT || 0,
//           female: raw.FEMALE_COUNT || 0,
//         },
//         age_groups: {
//           infant: raw.AGE_INFANT || 0,
//           child: raw.AGE_CHILD || 0,
//           young: raw.AGE_YOUNG || 0,
//           adult: raw.AGE_ADULT || 0,
//           senior: raw.AGE_SENIOR || 0,
//         },
//         patients: {
//           new: raw.NEW_PATIENTS || 0,
//           returning: raw.RETURNING_PATIENTS || 0,
//         },
//       },
//       revenue_split: {
//         outdoor: {
//           patients: raw.OUTDOOR_PATIENTS || 0,
//           revenue: raw.OUTDOOR_REVENUE || 0,
//           share_percent: raw.CONSULTANTSHAREOUTDOOR || 0,
//           consultant_earning: raw.CONSULTANT_OUTDOOR_EARNING || 0,
//         },
//         indoor: {
//           patients: raw.INDOOR_PATIENTS || 0,
//           revenue: raw.INDOOR_REVENUE || 0,
//           share_percent: raw.CONSULTANTSHAREINDOOR || 0,
//           consultant_earning: raw.CONSULTANT_INDOOR_EARNING || 0,
//         },
//         other: {
//           patients: raw.OTHER_PATIENTS || 0,
//           revenue: raw.OTHER_REVENUE || 0,
//         },
//         surgery_charges: raw.SURGERYCHARGES || 0,
//         anesthesia_charges: raw.ANESCHARGES || 0,
//         total_consultant_earning: raw.TOTAL_CONSULTANT_EARNING || 0,
//       },
//     };

//     res.status(200).json({ success: true, data: report });
//   } catch (err) {
//     console.error("getDoctorRangeReport error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   } finally {
//     if (connection) await connection.close().catch(() => {});
//   }
// };

module.exports = {
  getDoctorReport,
};

module.exports = { manageDoctor, getDoctors, getDoctorReport };

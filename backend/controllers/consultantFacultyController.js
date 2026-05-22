const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const path = require("path");

const getDoctorsByFacultyAndDate = async (req, res) => {
  let connection;
  try {
    const { facultyId, date } = req.query;

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN get_doctors_by_faculty_date(:facultyId, :date, :cursor); END;`,
      {
        facultyId: facultyId ? Number(facultyId) : null,
        date: date ? new Date(date) : new Date(),
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();
    await cursor.close();

    const data = rows.filter(row => row.SCHEDULE_ID !== null).map(row => ({
      consultantId:   row.CONSULTANT_ID,
      doctorName:     row.DOCTOR_NAME,
      degrees:        row.DEGREES,
      facultyId:      row.FACULTYID,
      facultyName:    row.FACULTY_NAME,
      roomNo:         row.ROOM_NO,
      callName:       row.CALL_NAME,
      imageUrl:       row.IMAGE_PATH
                        ? `/assets/consultant/${path.basename(row.IMAGE_PATH)}`
                        : null,
      // Schedule from doc_schedule_time
      schedule: row.SCHEDULE_ID
        ? {
            id:        row.SCHEDULE_ID,
            day:       row.SCHEDULE_DAY,
            startTime: row.SCHEDULE_START,
            endTime:   row.SCHEDULE_END,
            status:    row.SCHEDULE_STATUS
          }
        : null   // us din schedule nahi hai
    }));

    res.status(200).json({
      success: true,
      date: date || new Date().toISOString().split("T")[0],
      count: data.length,
      data
    });

  } catch (err) {
    console.error("getDoctorsByFacultyAndDate error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = { getDoctorsByFacultyAndDate };
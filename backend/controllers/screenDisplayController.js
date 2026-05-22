const oracledb = require("oracledb");
const poolPromise = require("../database.js");

// HMS se faculty list
const getHmsFaculties = async (req, res) => {
  let connection;
  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN get_hms_faculties(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    res.status(200).json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

// Screen mapping get karo
const getScreenFacultyMap = async (req, res) => {
  let connection;
  try {
    const { screenId } = req.query;
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN get_screen_faculty_map(:screenId, :retval); END;`,
      {
        screenId: screenId || null,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );

    const cursor = result.outBinds.retval;
    const rows = await cursor.getRows();
    await cursor.close();

    const data = rows.map((row) => {
      const facultyIdString = row[2] || "";
      const facultyNameString = row[3] || "";

      const ids = facultyIdString ? facultyIdString.split(",") : [];
      const names = facultyNameString ? facultyNameString.split(",") : [];

      const FACULTY = ids.map((id, index) => ({
        FACULTY_ID: Number(id),
        FACULTY_NAME: names[index] || "",
      }));

      return {
        SCREEN_ID: String(row[0]),
        SCREEN_NAME: row[1],
        FACULTY,
      };
    });

    res.status(200).json({ status: 200, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

// Screen mapping save karo (pehle CLEAR phir ADD)
const saveScreenFacultyMap = async (req, res) => {
  let connection;
  try {
    const { screenId, facultyIds, createdBy } = req.body;
    // facultyIds = [1, 7, 9]

    if (!screenId) {
      return res
        .status(400)
        .json({ success: false, message: "screenId required" });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Pehle sab clear karo
    await connection.execute(
      `BEGIN manage_screen_faculty_map(:screenId, NULL, 'CLEAR', NULL); END;`,
      { screenId },
      { autoCommit: false },
    );

    // Phir naye add karo
    if (facultyIds && facultyIds.length > 0) {
      for (const fId of facultyIds) {
        await connection.execute(
          `BEGIN manage_screen_faculty_map(:screenId, :facultyId, 'ADD', :createdBy); END;`,
          { screenId, facultyId: fId, createdBy: createdBy || "Admin" },
          { autoCommit: false },
        );
      }
    }

    await connection.commit();

    res
      .status(200)
      .json({ success: true, message: "Mapping saved successfully" });
  } catch (err) {
    if (connection) await connection.rollback().catch(() => {});
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = {
  getHmsFaculties,
  getScreenFacultyMap,
  saveScreenFacultyMap,
};

const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const fs = require("fs");
const path = require("path");

// Assets folder for consultant images
const consultantAssetDir = path.join(process.cwd(), "assets", "consultant");
if (!fs.existsSync(consultantAssetDir)) {
  fs.mkdirSync(consultantAssetDir, { recursive: true });
}

// ----------------- GET CONSULTANTS (SAB DATA + IMAGE) -----------------
const getConsultants = async (req, res) => {
  let connection;
  try {
    const { consultant_id } = req.query;

    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `BEGIN get_consultants_with_image(:id, :cursor); END;`,
      {
        id: consultant_id ? Number(consultant_id) : null,
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();
    await cursor.close();

    const data = rows.map((row) => ({
      id: row.ID,
      name: row.NAME,
      address: row.ADDRESS,
      tel: row.TEL,
      mobile: row.MOBILE,
      email: row.EMAIL,
      degrees: row.DEGREES,
      facultyId: row.FACULTYID,
      facultyName: row.FACULTY_NAME,
      hospitalRate: row.HOSPITALRATE,
      testTypeId: row.TESTTYPEID,
      consultantShareOutdoor: row.CONSULTANTSHAREOUTDOOR,
      hospitalShareOutdoor: row.HOSPITALSHAREOUTDOOR,
      consultantShareIndoor: row.CONSULTANTSHAREINDOOR,
      hospitalShareIndoor: row.HOSPITALSHAREINDOOR,
      opdPaid: row.OPDPAID,
      isDeactivate: row.ISDEACTIVATE,
      surgeryCharges: row.SURGERYCHARGES,
      anesCharges: row.ANESCHARGES,
      roomName: row.ROOM_NO || null,
      imagePath: row.IMAGE_PATH,

      imageUrl: row.IMAGE_PATH
        ? `/assets/consultant/${path.basename(row.IMAGE_PATH)}`
        : "/assets/consultant/doctoravatar.png", // Default image path
      scheduleSummary: row.SCHEDULE_SUMMARY || null,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

// ----------------- ADD/UPDATE IMAGE (SIRF IMAGE) -----------------
const upsertConsultantImage = async (req, res) => {
  let connection;

  try {
    const { consultant_id } = req.body;
    const file = req.file;

    if (!consultant_id) {
      return res
        .status(400)
        .json({ success: false, message: "consultant_id required" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file required" });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Check if consultant exists
    const checkResult = await connection.execute(
      `SELECT id, image_path FROM hms.consultant WHERE id = :id`,
      { id: consultant_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Consultant not found" });
    }

    const oldImagePath = checkResult.rows[0].IMAGE_PATH;

    // Delete old image file if exists
    if (oldImagePath) {
      const oldFullPath = path.join(
        consultantAssetDir,
        path.basename(oldImagePath),
      );
      if (fs.existsSync(oldFullPath)) {
        fs.unlinkSync(oldFullPath);
      }
    }

    // Save new image
    const ext = path.extname(file.originalname);
    const filename = `consultant_${consultant_id}${ext}`;
    const savePath = path.join(consultantAssetDir, filename);
    fs.writeFileSync(savePath, file.buffer);

    const imagePath = `consultant/${filename}`;

    // Update only image_path in HMS consultant table
    await connection.execute(
      `UPDATE hms.consultant SET image_path = :path WHERE id = :id`,
      { path: imagePath, id: consultant_id },
      { autoCommit: true },
    );

    res.status(200).json({
      success: true,
      message: "Image saved successfully",
      data: {
        consultant_id: consultant_id,
        image_path: imagePath,
        image_url: `/assets/${imagePath}`,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------- DELETE IMAGE (SIRF IMAGE) -----------------
const deleteConsultantImage = async (req, res) => {
  let connection;

  try {
    const { consultant_id } = req.params;

    if (!consultant_id) {
      return res
        .status(400)
        .json({ success: false, message: "consultant_id required" });
    }

    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Get old image path
    const result = await connection.execute(
      `SELECT image_path FROM hms.consultant WHERE id = :id`,
      { id: consultant_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Consultant not found" });
    }

    const oldImagePath = result.rows[0].IMAGE_PATH;

    // Delete image file if exists
    if (oldImagePath) {
      const oldFullPath = path.join(
        consultantAssetDir,
        path.basename(oldImagePath),
      );
      if (fs.existsSync(oldFullPath)) {
        fs.unlinkSync(oldFullPath);
      }
    }

    // Update: set image_path to NULL
    await connection.execute(
      `UPDATE hms.consultant SET image_path = NULL WHERE id = :id`,
      { id: consultant_id },
      { autoCommit: true },
    );

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  getConsultants,
  upsertConsultantImage,
  deleteConsultantImage,
};

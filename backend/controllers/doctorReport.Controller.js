const oracledb = require("oracledb");
const poolPromise = require("../database.js");

const getDoctorReport = async (req, res) => {
  const { doctorId, date, type = "DAILY" } = req.query;

  if (!doctorId)
    return res.status(400).json({ success: false, message: "doctorId required" });

  const validTypes = ["DAILY", "MONTHLY", "YEARLY"];
  if (!validTypes.includes(type.toUpperCase()))
    return res.status(400).json({ success: false, message: "type must be DAILY / MONTHLY / YEARLY" });

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const result = await connection.execute(
      `
      DECLARE
        v_cursor SYS_REFCURSOR;
      BEGIN
        get_doctor_report(
          p_doc_id => :doc_id,
          p_date   => :p_date,
          p_type   => :p_type,
          p_result => v_cursor
        );
        :cursor := v_cursor;
      END;
      `,
      {
        doc_id: Number(doctorId),
        p_date: date ? new Date(date) : new Date(),
        p_type: type.toUpperCase(),
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rs = result.outBinds.cursor;
    const rows = await rs.getRows();
    await rs.close();

    const raw = rows[0] || {};

    const report = {
      period: {
        type: type.toUpperCase(),
        date: date || new Date().toISOString().split("T")[0]
      },
      consultant: {
        id:      Number(doctorId),
        name:    raw.CONSULTANT_NAME || "",
        degrees: raw.DEGREES         || "",
        faculty: raw.FACULTY         || "",
      },
      summary: {
        total_patients: raw.TOTAL_PATIENTS || 0,
        total_gross:    raw.TOTAL_GROSS    || 0,
        total_discount: raw.TOTAL_DISCOUNT || 0,
        total_revenue:  raw.TOTAL_REVENUE  || 0,
        male:           raw.MALE_COUNT     || 0,
        female:         raw.FEMALE_COUNT   || 0,
        checked:        raw.CHECKED        || 0,
        remaining:      raw.REMAINING      || 0,
        skipped:        raw.SKIPPED        || 0,
        cancelled:      raw.CANCELLED      || 0,
      },
      demographics: {
        gender: {
          male:   raw.MALE_COUNT   || 0,
          female: raw.FEMALE_COUNT || 0,
        },
        age_groups: {
          infant: raw.AGE_INFANT || 0,
          child:  raw.AGE_CHILD  || 0,
          young:  raw.AGE_YOUNG  || 0,
          adult:  raw.AGE_ADULT  || 0,
          senior: raw.AGE_SENIOR || 0,
        },
        patients: {
          new:       raw.NEW_PATIENTS       || 0,
          returning: raw.RETURNING_PATIENTS || 0,
        }
      },
      revenue_split: {
        outdoor: {
          patients:           raw.OUTDOOR_PATIENTS           || 0,
          revenue:            raw.OUTDOOR_REVENUE            || 0,
          share_percent:      raw.CONSULTANTSHAREOUTDOOR     || 0,
          consultant_earning: raw.CONSULTANT_OUTDOOR_EARNING || 0,
        },
        indoor: {
          patients:           raw.INDOOR_PATIENTS            || 0,
          revenue:            raw.INDOOR_REVENUE             || 0,
          share_percent:      raw.CONSULTANTSHAREINDOOR      || 0,
          consultant_earning: raw.CONSULTANT_INDOOR_EARNING  || 0,
        },
        other: {
  patients: raw.OTHER_PATIENTS || 0,
  revenue:  raw.OTHER_REVENUE  || 0,
},
        surgery_charges:          raw.SURGERYCHARGES              || 0,
        anesthesia_charges:       raw.ANESCHARGES                 || 0,
        total_consultant_earning: raw.TOTAL_CONSULTANT_EARNING    || 0,
      }
    };

    res.status(200).json({ success: true, data: report });

  } catch (err) {
    console.error("getDoctorReport error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close().catch(() => {});
  }
};

module.exports = { getDoctorReport };
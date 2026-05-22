 const getScreensForFaculty = async (connection, facultyId) => {
  try {
    const result = await connection.execute(
      `SELECT screen_id FROM screen_faculty_map 
       WHERE faculty_id = :facultyId`,
      { facultyId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows.map(r => r.SCREEN_ID);
  } catch {
    return [];
  }
};

 const getDoctorFacultyId = async (connection, doctorId) => {
  try {
    const result = await connection.execute(
      `SELECT facultyid FROM hms.consultant WHERE id = :id`,
      { id: doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0]?.FACULTYID || null;
  } catch {
    return null;
  }
};

module.exports = {
  getScreensForFaculty,
  getDoctorFacultyId,
};
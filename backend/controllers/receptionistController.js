const oracledb = require("oracledb");
const poolPromise = require("../database.js");


const getOpdCategory = async (req, res) => {
  let connection;
  try {
    // connection = await poolPromise.getConnection();
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_opdcategory( retval => :retvals); END;`,
      {
        retvals: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retvals;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "OPD categories fetched successfully",
    });
  } catch (error) {
    console.error("Error in getOpdCategory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching OPD categories",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


const getPatientCategory = async (req, res) => {
  let connection;
  try {
    // Database connection establish karo
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_patientcategory(:retval); END;`,
      {
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "Patient categories fetched successfully",
    });
  } catch (error) {
    console.error("Error in getPatientCategory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient categories",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


const getAllConsultantByOpdCategory = async (req, res) => {
  const facultyId = req?.query.facultyId;

  let connection;

  try {
    // Database connection establish karo
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_consultant(:facultyId , :retval); END;`,
      {
        facultyId: facultyId || null,
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "All Consultant fetched successfully",
    });
  } catch (error) {
    console.error("Error in fetched All Consultant:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Consultant",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


const getReference = async (req, res) => {
  const patientTypeId = req?.params.patientid;

  if (!patientTypeId) {
    return res.status(400).json({
      success: false,
      message: "patientid is required",
    });
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_reference( vpatientid => :patientTypeId , retval => :retval); END;`,
      {
        patientTypeId: patientTypeId,
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "Reference fetched successfully",
    });
  } catch (error) {
    console.error("Error in getReference:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reference",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


const getAllMembers = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_members(:retval); END;`,
      {
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "Members fetched successfully",
    });
  } catch (error) {
    console.error("Error in get Members:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Members",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


const getLastPatient = async (req, res) => {

  const userName =  req?.params?.userName?.toString()

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_last_patient(:vusername , :retval); END;`,
      {
        vusername: userName,
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      data: data,
      message: "LastPatient fetched successfully",
    });
  } 
  catch (error) {
    console.error("Error in get LastPatient:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching LastPatient",
      error: error.message,
    });
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};




const addEditOpdReceipt = async (req, res) => {

  let connection;
  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Request body se data lo
    const {
      ReceiptNo,
      TokenNo,
      Vdate,
      CatagoryId,
      ConsultantID,
      PatientType,
      MemberID,
      PatientId,
      PatientTitle,
      PatientName,
      Gender,
      ContactNo,
      Age,
      AgeUnit,
      ReferenceId,
      Remarks,
      GrossAmount,
      Discount,
      NetAmount,
      User,
      TerminalId,
      status,
      isPartial,
      partialAmount,
      netbalance,
      electricitycharges,
      MRNo,
      Address,
      CNIC,
    } = req.body;

    // Validation - Required fields check karo
    if (!CatagoryId || !ConsultantID || !PatientName || !User) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: CatagoryId, ConsultantID, PatientName, User are required",
      });
    }

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN opdreceipt_add_edit(
        :ReceiptNo, :TokenNo, :Vdate, :CatagoryId, :ConsultantID, 
        :PatientType, :MemberID, :PatientId, :PatientTitle, :PatientName, 
        :Gender, :ContactNo, :Age, :AgeUnit, :ReferenceId, 
        :Remarks, :GrossAmount, :Discount, :NetAmount, :User, 
        :TerminalId, :status, :isPartial, :partialAmount, :netbalance, 
        :electricitycharges, :MRNo, :Address, :CNIC, :RetVoucherNo
      ); END;`,
      {
        ReceiptNo: ReceiptNo || null,
        TokenNo: TokenNo || null,
        Vdate: Vdate ? new Date(Vdate) : null,
        CatagoryId: CatagoryId,
        ConsultantID: ConsultantID,
        PatientType: PatientType || null,
        MemberID: MemberID || null,
        PatientId: PatientId || null,
        PatientTitle: PatientTitle || null,
        PatientName: PatientName,
        Gender: Gender || null,
        ContactNo: ContactNo || null,
        Age: Age || null,
        AgeUnit: AgeUnit || null,
        ReferenceId: ReferenceId || null,
        Remarks: Remarks || null,
        GrossAmount: GrossAmount || 0,
        Discount: Discount || 0,
        NetAmount: NetAmount || 0,
        User: User,
        TerminalId: TerminalId || null,
        status: status !== undefined ? status : 0,
        isPartial: isPartial || 0,
        partialAmount: partialAmount || 0,
        netbalance: netbalance || 0,
        electricitycharges: electricitycharges || 0,
        MRNo: MRNo || null,
        Address: Address || null,
        CNIC: CNIC || null,
        RetVoucherNo: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 20,
        },
      },
    );

    // ✅ Return voucher number from OUT parameter
    const voucherNo = result.outBinds.RetVoucherNo;

    res.status(200).json({
      success: true,
      data: {
        receiptNo: voucherNo,
      },
      message: ReceiptNo
        ? "OPD Receipt updated successfully"
        : "OPD Receipt created successfully",
    });

  } 
  catch (error) {
    console.error("Error in addEditOpdReceipt:", error);
    res.status(500).json({
      success: false,
      message: "Error processing OPD Receipt",
      error: error.message,
    });
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};


module.exports = {
  getOpdCategory,
  getPatientCategory,
  getAllConsultantByOpdCategory,
  getReference,
  getAllMembers,
  addEditOpdReceipt,
  getLastPatient
};

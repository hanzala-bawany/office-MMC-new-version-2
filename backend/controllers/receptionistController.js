const oracledb = require("oracledb");
const poolPromise = require("../database.js");
const {
  generateNewMrNumber,
} = require("../utills/helperFunctions/generateMrNum.js");
const { formatForOracle } = require("../utills/dateFormatCoverter.js");

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
  // const patientTypeId = req?.params.patientid;

  // if (!patientTypeId) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "patientid is required",
  //   });
  // }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_reference( retval => :retval); END;`,
      {
        // patientTypeId: patientTypeId,
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

const getMemberDependent = async (req, res) => {
  const memberNewNum = req?.params.newNo?.toString();

  if (!memberNewNum) {
    return res.status(400).json({
      success: false,
      message: "memberNewNum is required",
    });
  }

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_members_dependent(:memberNewNum , :retval); END;`,
      {
        memberNewNum,
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
      message: "Member Dependent fetched successfully",
    });
  } catch (error) {
    console.error("Error in get Member Dependent:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Member Dependent",
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
  const userName = req?.params?.userName?.toString();

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
  } catch (error) {
    console.error("Error in get LastPatient:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching LastPatient",
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

const getLabTest = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_test( :retval ); END;`,
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
      message: "lab Test fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error in get lab Test:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lab Test",
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

const getUsers = async (req, res) => {
  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN get_users( :retval ); END;`,
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
      message: "Users fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error in get Users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Users",
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
      laboratoryConsultantid,
    } = req.body || {};

    console.log(req.body, "req.body ...........");

    // Validation - Required fields check karo
    if (!CatagoryId || !ConsultantID || !PatientName || !User || !ContactNo) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: CatagoryId, ConsultantID, PatientName,ContactNo , User are required",
      });
    }

    const MrNo = await generateNewMrNumber(connection, ContactNo);

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN opdreceipt_add_edit_react(
        :ReceiptNo, :TokenNo, :Vdate, :CatagoryId, :ConsultantID, 
        :PatientType, :MemberID, :PatientId, :PatientTitle, :PatientName, 
        :Gender, :ContactNo, :Age, :AgeUnit, :ReferenceId, 
        :Remarks, :GrossAmount, :Discount, :NetAmount, :User, 
        :TerminalId, :status, :isPartial, :partialAmount, :netbalance, 
        :electricitycharges, :laboratoryConsultantid ,:MrNo , :RetVoucherNo
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
        Age: Age?.toString() || null,
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
        laboratoryConsultantid: laboratoryConsultantid || null,
        MrNo: MrNo || null,
        RetVoucherNo: {
          type: oracledb.STRING,
          dir: oracledb.BIND_OUT,
          maxSize: 20,
        },
      },
      { autoCommit: true },
    );

    // ✅ Return voucher number from OUT parameter
    const voucherNo = result.outBinds.RetVoucherNo;

    res.status(200).json({
      success: true,
      data: {
        receiptNo: voucherNo,
        mrNo: MrNo,
      },
      message:
        ReceiptNo && ReceiptNo !== "0" && ReceiptNo !== null
          ? "OPD Receipt updated successfully"
          : "OPD Receipt created successfully",
    });
  } catch (error) {
    console.error("Error in addEditOpdReceipt:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error processing OPD Receipt",
      error: error,
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

const getPatientsbyFilter = async (req, res) => {
  const {
    fromDate = null,
    toDate = null,
    userId = null,
    receiptNo = null,
    contactNo = null,
    categoryId = null,
    pageNo = null,
    pageSize = null,
  } = req?.query || {};

  let connection;

  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();

    const formattedFromDate = formatForOracle(fromDate);
    const formattedToDate = formatForOracle(toDate);

    const finalPageNo = pageNo ? Number(pageNo) : 1;
    const finalPageSize = pageSize ? Number(pageSize) : 5;

    const skipDataCount = (finalPageNo - 1) * finalPageSize; 

    // Stored procedure call karo
    const result = await connection.execute(
      `BEGIN 
      get_opdreceipt_list(     
        :fromDate,
        :toDate,
        :userId,
        :receiptNo,
        :contactNo,
        :categoryId,
        :skipDataCount,
        :pageSize,
        :totalCount, 
        :retval
      ); 
      END;`,
      {
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        userId,
        receiptNo,
        contactNo,
        categoryId,
        skipDataCount: skipDataCount,
        pageSize: finalPageSize,
        totalCount: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        retval: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // Cursor se data fetch karo
    const totalCountData = result.outBinds.totalCount;
    const cursor = result.outBinds.retval;
    const data = await cursor.getRows();
    await cursor.close();

    // Response bhejo
    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      total: totalCountData,     
      data: data,
    });
  } catch (error) {
    console.error("Error in get Patients:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Patients",
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

module.exports = {
  getOpdCategory,
  getPatientCategory,
  getAllConsultantByOpdCategory,
  getReference,
  getAllMembers,
  addEditOpdReceipt,
  getLastPatient,
  getLabTest,
  getMemberDependent,
  getUsers,
  getPatientsbyFilter,
};

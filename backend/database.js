const oracledb = require("oracledb");
require("dotenv").config();

oracledb.initOracleClient({
  libDir: "./Oracle/instantclient_21_20",
});

async function initPool() {
  try {
    const pool = await oracledb.createPool({
      user: process.env.user,
      password: process.env.password,
      connectString: process.env.connectString,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log("Connection pool started");
    return pool;
  } catch (err) {
    console.error("Error creating connection pool:", err);
    process.exit(1);
  }
}

const poolPromise = initPool();

module.exports = poolPromise;

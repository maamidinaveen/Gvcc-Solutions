const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dotenv = require("dotenv");

dotenv.config();

let dbInstance = null;

const dbPath = path.join(__dirname, "products.db");

const getDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.exec("PRAGMA foreign_keys = ON;");

  return dbInstance;
};

module.exports = { getDB };

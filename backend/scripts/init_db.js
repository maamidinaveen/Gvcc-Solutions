const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "src", "db", "products.db");
const schemaPath = path.join(__dirname, "..", "sql", "schema.sql");
const seedPath = path.join(__dirname, "..", "sql", "seed.sql");

const schemaSQL = fs.readFileSync(schemaPath, "utf8");
const seedSQL = fs.readFileSync(seedPath, "utf8");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log(">> Initializing database...");

  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(schemaSQL, (err) => {
    if (err) {
      console.error("Schema error:", err);
      return;
    }
    console.log("✓ Schema created.");

    db.exec(seedSQL, (err2) => {
      if (err2) {
        console.error("Seed error:", err2);
      } else {
        console.log("✓ Seed data inserted.");
      }
      db.close();
    });
  });
});

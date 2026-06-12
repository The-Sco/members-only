#!/usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Please provide DATABASE_URL in your .env file");
  process.exit(1);
}

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
`;

async function main() {
  console.log("Connecting to database and seeding...");
  const isLocalhost =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");
  const client = new Client({
    connectionString: connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log("Creating tables...");
    await client.query(SQL);

    console.log("Clearing old data...");
    await client.query("TRUNCATE messages, users CASCADE;");

    console.log("Hashing passwords...");
    const hashedPassword1 = await bcrypt.hash("guest123", 10);
    const hashedPassword2 = await bcrypt.hash("member123", 10);
    const hashedPassword3 = await bcrypt.hash("admin123", 10);

    console.log("Inserting users...");
    const userInsertQuery = `
      INSERT INTO users (first_name, last_name, username, password, is_member, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;

    const res1 = await client.query(userInsertQuery, [
      "John",
      "Doe",
      "johndoe",
      hashedPassword1,
      false,
      false,
    ]);
    const guestId = res1.rows[0].id;

    const res2 = await client.query(userInsertQuery, [
      "Luna",
      "Lovegood",
      "luna",
      hashedPassword2,
      true,
      false,
    ]);
    const memberId = res2.rows[0].id;

    const res3 = await client.query(userInsertQuery, [
      "Boss",
      "Admin",
      "admin",
      hashedPassword3,
      true,
      true,
    ]);
    const adminId = res3.rows[0].id;

    console.log("Inserting messages...");
    const messageInsertQuery = `
      INSERT INTO messages (user_id, title, text)
      VALUES ($1, $2, $3);
    `;

    await client.query(messageInsertQuery, [
      guestId,
      "Hello World!",
      "This is my first message here. Super excited!",
    ]);
    await client.query(messageInsertQuery, [
      memberId,
      "Secret Plushie Club",
      "The secret code is so cozy. Glad to be a member!",
    ]);
    await client.query(messageInsertQuery, [
      adminId,
      "System Announcement",
      "Welcome to Members Only! Keep it friendly and clean.",
    ]);

    console.log("Done! Database successfully populated.");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    await client.end();
  }
}

main();

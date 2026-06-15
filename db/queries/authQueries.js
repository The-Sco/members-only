const pool = require("../pool");
const bcrypt = require("bcryptjs");

async function checkIfUserExists(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (rows[0]) {
    return true;
  }

  return false;
}

async function newUser(first_name, last_name, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *;",
    [first_name, last_name, username, hashedPassword],
  );
  return rows[0];
}

module.exports = {
  newUser,
  checkIfUserExists,
};

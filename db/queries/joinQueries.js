const pool = require("../pool");

async function setMember(id) {
  await pool.query("UPDATE users SET is_member = true WHERE id = $1", [id]);
  return;
}

async function setAdmin(id) {
  await pool.query(
    "UPDATE users SET is_admin = true, is_member = true WHERE id = $1",
    [id],
  );
  return;
}

module.exports = {
  setAdmin,
  setMember,
};

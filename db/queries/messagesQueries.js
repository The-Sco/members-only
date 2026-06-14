const pool = require("../pool");

async function getAllMessages(is_member) {
  const memberQuery = `
      SELECT u.first_name, u.last_name, u.username, m.title, m.text, m.id FROM messages m
      INNER JOIN users u ON m.user_id = u.id
    `;
  const notMemberQuery = "SELECT * FROM messages";
  const res = await pool.query(is_member ? memberQuery : notMemberQuery);
  return res.rows;
}

async function getSingleMessage(id, is_member) {
  const memberQuery = `
    SELECT u.first_name, u.last_name, u.username, m.title, m.text, m.id, m.timestamp FROM messages m
    INNER JOIN users u ON m.user_id = u.id
    WHERE m.id = $1
  `;
  const notMemberQuery = "SELECT * FROM messages WHERE id = $1";

  const res = await pool.query(is_member ? memberQuery : notMemberQuery, [id]);
  return res.rows[0];
}

async function newMessage(id, title, text) {
  await pool.query(
    "INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)",
    [id, title, text],
  );
  return;
}

async function getUserMessages(id) {
  const res = await pool.query(
    `
    SELECT first_name, last_name, username, m.id, title, text, timestamp FROM messages m
    INNER JOIN users u ON m.user_id = u.id
    WHERE m.user_id = $1
    `,
    [id],
  );
  return (await res).rows;
}

async function deleteMessagePost(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
  return;
}

module.exports = {
  getAllMessages,
  getSingleMessage,
  newMessage,
  getUserMessages,
  deleteMessagePost,
};

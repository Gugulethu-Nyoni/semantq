// Likely models/mysql/User.js (or wherever your User model is defined)

import { v4 as uuidv4 } from 'uuid'; // Don't forget this if you need it
import db from '../adapters/mysql.js'; // Adjust path if necessary

const User = {
  async findUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // ADD THIS METHOD:
  async findAllUsers() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  },

  async createUser(data) {
    const { email, password } = data;
    const uuid = uuidv4(); // Generate UUID
    await db.query(
      'INSERT INTO users (uuid, email, password_hash) VALUES (?, ?, ?)',
      [uuid, email, password]
    );
    // You might want to return the newly created user or its ID
    const [rows] = await db.query('SELECT * FROM users WHERE uuid = ?', [uuid]);
    return rows[0];
  },

  async updateUser(id, data) {
    const { email, password, name } = data; // Ensure 'name' is in your database schema if used
    const sql = `UPDATE users SET email = ?, password_hash = ?, name = ? WHERE id = ?`;
    await db.query(sql, [email, password, name, id]); // Assuming `name` is a column
    // Fetch and return the updated user
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // ADD THIS METHOD:
  async deleteUser(id) {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  // result object for DELETE operations often contains affectedRows
  return result.affectedRows > 0; // Return true if at least one row was affected, false otherwise
}
};

export default User;
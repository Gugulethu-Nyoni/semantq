import { v4 as uuidv4 } from 'uuid';
import db from '../adapters/mysql.js';

const DemoModel = {
  async findDemoModelById(id) {
    const [rows] = await db.query('SELECT * FROM demomodels WHERE id = ?', [id]);
    return rows[0];
  },

  async findAllDemoModels() {
    const [rows] = await db.query('SELECT * FROM demomodels');
    return rows;
  },

  async createDemoModel(data) {
    const { name, description } = data; // Replace or expand these as needed
    const uuid = uuidv4();
    await db.query(
      'INSERT INTO demomodels (uuid, name, description) VALUES (?, ?, ?)',
      [uuid, name, description]
    );
    const [rows] = await db.query('SELECT * FROM demomodels WHERE uuid = ?', [uuid]);
    return rows[0];
  },

  async updateDemoModel(id, data) {
    const { name, description } = data;
    const sql = `UPDATE demomodels SET name = ?, description = ? WHERE id = ?`;
    await db.query(sql, [name, description, id]);
    const [rows] = await db.query('SELECT * FROM demomodels WHERE id = ?', [id]);
    return rows[0];
  },

  async deleteDemoModel(id) {
    const [result] = await db.query('DELETE FROM demomodels WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default DemoModel;

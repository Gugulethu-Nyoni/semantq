import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
});

export default pool;

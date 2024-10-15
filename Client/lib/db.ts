import mysql, { Pool } from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lenny',
  database: '459midterm',
});

export default pool;

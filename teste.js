// testando
import { pool } from './db.js';

async function testDB() {
  const res = await pool.query('SELECT * FROM users;');
  console.log(res.rows);
  pool.end();
}

testDB();

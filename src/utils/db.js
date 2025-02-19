import { Pool } from 'pg';

const pool = new Pool({
  user: 'thoughts',
  host: '100.89.127.21',
  database: 'thoughts',
  password: 'asdfghjkl',
  port: 5432,
});

export default async function query(text, params) {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  }
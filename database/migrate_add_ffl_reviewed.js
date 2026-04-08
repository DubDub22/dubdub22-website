#!/usr/bin/env node
// migrate_add_ffl_reviewed.js
// Adds ffl_reviewed column to dealers table

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dubdub_user:DubDubDB2024!@localhost/dubdub22',
});

async function main() {
  const client = await pool.connect();
  try {
    // Check if column exists
    const { rows } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'dealers' AND column_name = 'ffl_reviewed'
    `);
    if (rows.length > 0) {
      console.log('ffl_reviewed column already exists, skipping.');
      return;
    }
    await client.query(`
      ALTER TABLE dealers ADD COLUMN ffl_reviewed boolean DEFAULT false
    `);
    console.log('Added ffl_reviewed column to dealers table.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });

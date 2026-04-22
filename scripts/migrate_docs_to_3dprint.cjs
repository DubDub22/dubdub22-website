#!/usr/bin/env node
/**
 * migrate_docs_to_3dprint.js
 * Migrate documents from Postgres submissions table to 3dprintmanager SFTP.
 * Then optionally null out the base64 data in the DB.
 */
const { Client } = require('ssh2');
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://dubdub_user:DubDubDB2024!@localhost/dubdub22' });

const SFTP_HOST = '100.99.180.68';
const SFTP_PORT = 22;
const SFTP_USER = 'dealer-uploader';
const SFTP_KEY = '/root/.ssh/id_ed25519';
const BASE_DIR = '/home/dealer-uploader/dealer-docs';

async function sftpUpload(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) { conn.end(); return reject(err); }
        const dir = remotePath.substring(0, remotePath.lastIndexOf('/'));
        sftp.mkdir(dir, { mode: '0755' }, () => {
          sftp.fastPut(localPath, remotePath, (writeErr) => {
            conn.end();
            if (writeErr) reject(writeErr);
            else resolve();
          });
        });
      });
    });
    conn.on('error', (e) => { conn.end(); reject(e); });
    conn.connect({
      host: SFTP_HOST, port: SFTP_PORT, username: SFTP_USER,
      privateKey: fs.readFileSync(SFTP_KEY),
    });
  });
}

async function run() {
  const dryRun = process.argv.includes('--dry-run');
  const nullAfter = process.argv.includes('--null-after');

  console.log('=== Document Migration to 3dprintmanager ===');
  if (dryRun) console.log('DRY RUN - no files will be uploaded');

  const result = await pool.query(`
    SELECT id, ffl_license_number, business_name, type,
           ffl_file_name, ffl_file_data,
           sot_file_name, sot_file_data,
           tax_form_name, tax_form_data,
           state_tax_file_name, state_tax_file_data,
           created_at
    FROM submissions
    WHERE (ffl_file_data IS NOT NULL AND ffl_file_data != '')
       OR (sot_file_data IS NOT NULL AND sot_file_data != '')
       OR (tax_form_data IS NOT NULL AND tax_form_data != '')
       OR (state_tax_file_data IS NOT NULL AND state_tax_file_data != '')
    ORDER BY created_at
  `);

  console.log(`Found ${result.rows.length} submissions with documents\n`);

  for (const row of result.rows) {
    const { id, ffl_license_number: ffl, business_name: biz, type, created_at } = row;

    let folder;
    if (ffl && ffl.trim()) {
      folder = ffl.trim();
    } else if (biz && biz.trim()) {
      folder = 'biz-' + biz.trim().replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 40);
    } else {
      folder = 'sub-' + id.substring(0, 8);
    }
    folder = folder.replace(/[^a-zA-Z0-9\.\-_]/g, '_');
    const dateStr = created_at ? created_at.split(' ')[0].replace(/-/g, '') : 'nodate';

    console.log(`--- ${biz || '(no name)'} (${ffl || 'no-ffl'}) ---`);

    const docs = [
      { col: 'ffl_file_data', fn: row.ffl_file_name, data: row.ffl_file_data, suffix: 'ffl' },
      { col: 'sot_file_data', fn: row.sot_file_name, data: row.sot_file_data, suffix: 'sot' },
      { col: 'tax_form_data', fn: row.tax_form_name, data: row.tax_form_data, suffix: 'tax_form' },
      { col: 'state_tax_file_data', fn: row.state_tax_file_name, data: row.state_tax_file_data, suffix: 'state_tax' },
    ];

    for (const doc of docs) {
      if (!doc.data || !doc.fn) continue;

      const ext = (doc.fn.split('.').pop() || 'pdf').toLowerCase();
      const remoteFile = `${BASE_DIR}/${folder}/${doc.suffix}_${dateStr}.${ext}`;
      const localTmp = `/tmp/doc_migrate_${Date.now()}_${Math.random()}.bin`;

      try {
        const buf = Buffer.from(doc.data, 'base64');
        fs.writeFileSync(localTmp, buf);
        const sizeKB = Math.round(buf.length / 1024);
        console.log(`  Upload ${doc.suffix}: ${sizeKB}KB -> ${remoteFile}`);

        if (!dryRun) {
          await sftpUpload(localTmp, remoteFile);
          console.log(`  OK`);
        }
      } catch (err) {
        console.error(`  ERROR: ${err.message}`);
      } finally {
        if (fs.existsSync(localTmp)) fs.unlinkSync(localTmp);
      }
    }
  }

  if (nullAfter && !dryRun) {
    console.log('\n=== Nulling out base64 data in DB ===');
    const nulls = await pool.query(`
      UPDATE submissions
      SET ffl_file_data = NULL, ffl_file_name = NULL,
          sot_file_data = NULL, sot_file_name = NULL,
          tax_form_data = NULL, tax_form_name = NULL,
          state_tax_file_data = NULL, state_tax_file_name = NULL
      WHERE (ffl_file_data IS NOT NULL AND ffl_file_data != '')
         OR (sot_file_data IS NOT NULL AND sot_file_data != '')
         OR (tax_form_data IS NOT NULL AND tax_form_data != '')
         OR (state_tax_file_data IS NOT NULL AND state_tax_file_data != '')
    `);
    console.log(`Nulled ${nulls.rowCount} rows`);
  } else if (nullAfter && dryRun) {
    console.log('\n[Would null out base64 data]');
  }

  
  console.log('\nDone.');
}

run().catch(e => { console.error(e); process.exit(1); });

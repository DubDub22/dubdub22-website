import fs from "fs";
import path from "path";
import { pool } from "./db";

const CSV_PATH = "/home/dubdub/DubDubSuppressor/ffl_master.csv";

function padLeft(str: string, len: number): string {
  return String(str).padStart(len, "0");
}

function parseFFLNumber(rec: Record<string, string>): string {
  const reg = padLeft(rec.LIC_REGN.trim(), 2);
  const dist = padLeft(rec.LIC_DIST.trim(), 3);
  const cnty = padLeft(rec.LIC_CNTY.trim(), 3);
  const type = padLeft(rec.LIC_TYPE.trim(), 2);
  const exp = rec.LIC_XPRDTE.trim().toUpperCase();
  const seq = padLeft(rec.LIC_SEQN.trim(), 5);
  return `${reg}-${dist}-${cnty}-${type}-${exp}-${seq}`;
}

function parseZipCode(raw: string): string {
  const digits = raw.trim().replace(/\D/g, "");
  if (digits.length <= 5) return padLeft(digits, 5);
  // Remove Zip+4 (last 4 digits), then pad to 5
  return padLeft(digits.slice(0, digits.length - 4), 5);
}

export interface FFLRecord {
  fflNumber: string;
  licenseeName: string;
  businessName: string;
  premiseStreet: string;
  premiseCity: string;
  premiseState: string;
  premiseZip: string;
  voicePhone: string;
}

// In-memory lookup: normalized FFL -> record
let fflMap: Map<string, FFLRecord> = new Map();
let loaded = false;

function normalizeKey(ffl: string): string {
  return ffl.replace(/[^0-9A-Za-z]/gi, "").toUpperCase();
}

export async function loadFFLMaster(): Promise<void> {
  if (loaded) return;
  const content = fs.readFileSync(CSV_PATH, "utf8");
  const lines = content.split("\n");
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Simple CSV parse — handle quoted fields with commas inside
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());

    if (fields.length < 13) continue;

    const rec: Record<string, string> = {
      LIC_REGN: fields[0],
      LIC_DIST: fields[1],
      LIC_CNTY: fields[2],
      LIC_TYPE: fields[3],
      LIC_XPRDTE: fields[4],
      LIC_SEQN: fields[5],
      LICENSE_NAME: fields[6].replace(/^"|"$/g, ""),
      BUSINESS_NAME: fields[7].replace(/^"|"$/g, ""),
      PREMISE_STREET: fields[8].replace(/^"|"$/g, ""),
      PREMISE_CITY: fields[9].replace(/^"|"$/g, ""),
      PREMISE_STATE: fields[10].replace(/^"|"$/g, ""),
      PREMISE_ZIP_CODE: fields[11],
      VOICE_PHONE: fields[12] || "",
    };

    const fflNumber = parseFFLNumber(rec);
    const normalized = normalizeKey(fflNumber);
    const licenseeName = rec.LICENSE_NAME;
    const businessName = rec.BUSINESS_NAME || rec.LICENSE_NAME;

    fflMap.set(normalized, {
      fflNumber,
      licenseeName,
      businessName,
      premiseStreet: rec.PREMISE_STREET,
      premiseCity: rec.PREMISE_CITY,
      premiseState: rec.PREMISE_STATE,
      premiseZip: parseZipCode(rec.PREMISE_ZIP_CODE),
      voicePhone: rec.VOICE_PHONE,
    });
  }
  loaded = true;
  console.log(`[ffl-master] Loaded ${fflMap.size} FFL records`);
}

export function validateFFL(fflNumber: string): FFLRecord | null {
  if (!loaded) return null;
  const normalized = normalizeKey(fflNumber);
  return fflMap.get(normalized) || null;
}

export function getFFLCount(): number {
  return fflMap.size;
}

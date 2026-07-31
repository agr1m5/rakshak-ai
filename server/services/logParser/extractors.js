import { parse as parseCsvSync } from "csv-parse/sync";
import { COMBINED_LOG_REGEX, IP_REGEX } from "./patterns.js";

// Case-insensitive lookup across common header/field name variants —
// real-world logs don't agree on "ip" vs "ip_address" vs "clientIp".
function pickField(obj, candidates) {
  const keys = Object.keys(obj);
  for (const candidate of candidates) {
    const match = keys.find((k) => k.toLowerCase() === candidate);
    if (match && obj[match] !== undefined && obj[match] !== "") return obj[match];
  }
  return null;
}

const IP_FIELDS = ["ip", "ip_address", "ipaddress", "clientip", "client_ip", "remote_addr", "source_ip", "sourceip"];
const URL_FIELDS = ["url", "path", "request", "endpoint", "uri"];
const STATUS_FIELDS = ["status", "statuscode", "status_code", "response_code", "code"];
const MESSAGE_FIELDS = ["message", "msg", "description", "event", "log", "text"];
const METHOD_FIELDS = ["method", "http_method", "verb"];

export function parseTextEntries(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const match = line.match(COMBINED_LOG_REGEX);
      if (match) {
        const [, ip, , method, path, status] = match;
        return { raw: line, ip, method, path, status, message: null };
      }
      // Doesn't match combined log format — keep the raw line so it's
      // still scanned for IPs and suspicious patterns, just with less
      // structure than a proper access-log line would give us.
      const looseIp = line.match(IP_REGEX)?.[0] || null;
      return { raw: line, ip: looseIp, method: null, path: null, status: null, message: null };
    });
}

export function parseJsonEntries(content) {
  let records;
  try {
    const parsed = JSON.parse(content);
    records = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Not a single valid JSON document — try newline-delimited JSON (NDJSON).
    records = content
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  return records.map((record) => {
    if (typeof record !== "object" || record === null) {
      return { raw: String(record), ip: null, method: null, path: null, status: null, message: null };
    }
    return {
      raw: JSON.stringify(record),
      ip: pickField(record, IP_FIELDS),
      method: pickField(record, METHOD_FIELDS),
      path: pickField(record, URL_FIELDS),
      status: pickField(record, STATUS_FIELDS)?.toString() || null,
      message: pickField(record, MESSAGE_FIELDS),
    };
  });
}

export function parseCsvEntries(content) {
  let rows;
  try {
    rows = parseCsvSync(content, { columns: true, skip_empty_lines: true, relax_column_count: true });
  } catch {
    // Malformed CSV — treat each line as an unstructured entry rather
    // than failing the whole parse.
    return content
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => ({ raw: line, ip: null, method: null, path: null, status: null, message: null }));
  }

  return rows.map((row) => ({
    raw: JSON.stringify(row),
    ip: pickField(row, IP_FIELDS),
    method: pickField(row, METHOD_FIELDS),
    path: pickField(row, URL_FIELDS),
    status: pickField(row, STATUS_FIELDS)?.toString() || null,
    message: pickField(row, MESSAGE_FIELDS),
  }));
}

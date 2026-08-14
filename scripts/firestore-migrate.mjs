#!/usr/bin/env node
/**
 * Firestore export / import between two Firebase projects.
 *
 * This site is a second copy of an existing deployment: same code, same data,
 * different brand name and different Firebase project. There were never any
 * seed scripts — the original catalogue was written straight into Firestore —
 * so this is the tool that reproduces that database somewhere else.
 *
 *   1. export from the original project
 *      node scripts/firestore-migrate.mjs export --env ../kabir/.env.local --out ./dump.json
 *
 *   2. import into the new project
 *      node scripts/firestore-migrate.mjs import --sa ./service-account.json --in ./dump.json
 *
 * Credentials come from one of (checked in this order):
 *   --sa <path>    a service-account key JSON
 *   --env <path>   a .env file holding FIREBASE_PROJECT_ID / _CLIENT_EMAIL / _PRIVATE_KEY
 *   the process environment, using those same three variables
 *
 * Collections default to the catalogue plus editable site content. Leads,
 * admin accounts and sessions are NOT copied: leads are personal data
 * belonging to the original site, and admin accounts are per-deployment (the
 * new site bootstraps its first admin at /admin/login). Pass --collections to
 * override, and --dry-run to see the plan without writing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const DEFAULT_COLLECTIONS = ["colleges", "content"];
/** Never copied by default — see the header. */
const SENSITIVE = new Set(["leads", "admins", "admin_sessions"]);

/* ------------------------------ arguments ------------------------------- */

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = rest[i + 1];
    if (next && !next.startsWith("--")) {
      flags[key] = next;
      i++;
    } else {
      flags[key] = true;
    }
  }
  return { command, flags };
}

/* ----------------------------- credentials ------------------------------ */

/**
 * Minimal .env reader. Handles `KEY=value`, quoted values and the literal \n
 * escapes a PEM private key carries when it lives on one line.
 */
function readEnvFile(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** Same normalisation as lib/firebaseAdmin.ts — keys arrive mangled in every direction. */
function normalisePrivateKey(raw) {
  let key = String(raw).trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  if (!key.includes("BEGIN")) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf8");
      if (decoded.includes("BEGIN")) key = decoded;
    } catch {
      /* not base64 — let cert() report it */
    }
  }
  return key.replace(/\\r/g, "").replace(/\\n/g, "\n").replace(/\r/g, "");
}

function credentialsFrom(flags) {
  if (flags.sa) {
    const json = JSON.parse(readFileSync(flags.sa, "utf8"));
    if (!json.project_id || !json.client_email || !json.private_key) {
      throw new Error(`${flags.sa} is not a service-account key (missing project_id/client_email/private_key).`);
    }
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: normalisePrivateKey(json.private_key),
    };
  }

  const env = flags.env ? { ...process.env, ...readEnvFile(flags.env) } : process.env;
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "No credentials. Pass --sa <service-account.json>, or --env <.env file>, or set " +
        "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  return {
    projectId: FIREBASE_PROJECT_ID.trim(),
    clientEmail: FIREBASE_CLIENT_EMAIL.trim(),
    privateKey: normalisePrivateKey(FIREBASE_PRIVATE_KEY),
  };
}

function connect(flags, name) {
  const credential = credentialsFrom(flags);
  const app = initializeApp({ credential: cert(credential) }, name);
  return { db: getFirestore(app), projectId: credential.projectId };
}

/* --------------------------- value round-trip ---------------------------- */

/**
 * Firestore values are richer than JSON. Only Timestamps actually occur in this
 * dataset today, but tagging them keeps a re-import byte-identical instead of
 * silently turning dates into strings.
 */
function toJson(value) {
  if (value instanceof Timestamp) return { __type__: "timestamp", value: value.toDate().toISOString() };
  if (Array.isArray(value)) return value.map(toJson);
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toJson(v)]));
  }
  return value;
}

function fromJson(value) {
  if (value && typeof value === "object" && value.__type__ === "timestamp") {
    return Timestamp.fromDate(new Date(value.value));
  }
  if (Array.isArray(value)) return value.map(fromJson);
  if (value && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fromJson(v)]));
  }
  return value;
}

/* -------------------------------- commands ------------------------------- */

function collectionsFrom(flags) {
  const names = flags.collections
    ? String(flags.collections).split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_COLLECTIONS;

  for (const name of names) {
    if (SENSITIVE.has(name) && !flags.collections) {
      throw new Error(`Refusing to copy "${name}" implicitly.`);
    }
  }
  return names;
}

async function exportCommand(flags) {
  const out = flags.out ?? "./firestore-dump.json";
  const { db, projectId } = connect(flags, "source");
  const names = collectionsFrom(flags);

  console.log(`Exporting from ${projectId}: ${names.join(", ")}`);
  const collections = {};
  for (const name of names) {
    const snap = await db.collection(name).get();
    collections[name] = snap.docs.map((doc) => ({ id: doc.id, data: toJson(doc.data()) }));
    console.log(`  ${name}: ${snap.size} document(s)`);
  }

  // No timestamp in the file: it would make every dump differ from the last for
  // no reason, which hides whether the data actually changed.
  const dump = { projectId, collections };
  if (flags["dry-run"]) {
    console.log(`Dry run — nothing written to ${out}.`);
    return;
  }
  writeFileSync(out, `${JSON.stringify(dump, null, 2)}\n`);
  console.log(`Wrote ${out}`);
}

async function importCommand(flags) {
  const input = flags.in ?? "./firestore-dump.json";
  const dump = JSON.parse(readFileSync(input, "utf8"));
  const { db, projectId } = connect(flags, "target");

  if (dump.projectId === projectId) {
    throw new Error(
      `Refusing to import into ${projectId} — that is the project the dump came from.`,
    );
  }

  const names = flags.collections ? collectionsFrom(flags) : Object.keys(dump.collections);
  console.log(`Importing into ${projectId} from ${input}`);

  for (const name of names) {
    const docs = dump.collections[name] ?? [];
    if (!docs.length) {
      console.log(`  ${name}: nothing in the dump — skipped`);
      continue;
    }

    // The target is expected to be empty. Overwriting a populated collection is
    // a data-loss move, so it has to be asked for.
    const existing = await db.collection(name).limit(1).get();
    if (!existing.empty && !flags.overwrite) {
      throw new Error(
        `"${name}" already has documents in ${projectId}. Re-run with --overwrite to replace them.`,
      );
    }

    if (flags["dry-run"]) {
      console.log(`  ${name}: would write ${docs.length} document(s)`);
      continue;
    }

    // Firestore caps a batch at 500 writes.
    for (let i = 0; i < docs.length; i += 400) {
      const batch = db.batch();
      for (const doc of docs.slice(i, i + 400)) {
        batch.set(db.collection(name).doc(doc.id), fromJson(doc.data));
      }
      await batch.commit();
    }
    console.log(`  ${name}: wrote ${docs.length} document(s)`);
  }

  if (!flags["dry-run"]) {
    console.log(
      "\nDone. Sign in at /admin/login — with an empty `admins` collection it offers a " +
        "\"create first admin\" form.",
    );
  }
}

/* --------------------------------- main ---------------------------------- */

const { command, flags } = parseArgs(process.argv.slice(2));

try {
  if (command === "export") await exportCommand(flags);
  else if (command === "import") await importCommand(flags);
  else {
    console.error(
      "Usage:\n" +
        "  node scripts/firestore-migrate.mjs export --env <.env> [--sa <key.json>] [--out dump.json]\n" +
        "  node scripts/firestore-migrate.mjs import --sa <key.json> [--in dump.json] [--overwrite]\n" +
        "\nOptions: --collections a,b   --dry-run",
    );
    process.exit(1);
  }
} catch (err) {
  console.error(`\n${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

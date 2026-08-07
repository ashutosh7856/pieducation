import "server-only";
import {
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with scrypt from node's own crypto — no dependency, and
 * memory-hard, so a leaked `admins` collection can't be run through a GPU.
 *
 * Stored form: `scrypt:N:r:p:<salt base64>:<key base64>`. The parameters travel
 * with the hash so raising the cost later doesn't invalidate existing accounts.
 */

// promisify picks the overload without options, so name the signature we want.
const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
/** node's 32MB default is below what N=16384, r=8 needs. */
const MAXMEM = 64 * 1024 * 1024;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(plain, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt:${N}:${R}:${P}:${salt.toString("base64")}:${key.toString("base64")}`;
}

/**
 * True if `plain` matches `stored`. Anything that isn't in the scrypt format is
 * treated as a legacy plaintext password and compared directly — accounts
 * created before hashing still sign in, and `authenticate` re-hashes them on
 * the way through.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (needsRehash(stored)) return stored.length > 0 && stored === plain;

  const [, n, r, p, salt, key] = stored.split(":");
  const expected = Buffer.from(key, "base64");
  const actual = await scrypt(plain, Buffer.from(salt, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAXMEM,
  });

  return timingSafeEqual(actual, expected);
}

/** Everything that isn't already a scrypt hash needs rewriting on next login. */
export function needsRehash(stored: string): boolean {
  return !stored.startsWith("scrypt:");
}

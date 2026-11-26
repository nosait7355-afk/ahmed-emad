/**
 * Writes description / instructions / mistakes / tips onto the imported
 * Fitxnet exercises. Run with: npx tsx scripts/apply-fitxnet-content.mts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CONTENT as C1 } from "./fitxnet-exercise-content.mts";
import { CONTENT_2 } from "./fitxnet-exercise-content-2.mts";

const CONTENT = { ...C1, ...CONTENT_2 };


function loadEnv() {
  const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of file.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let val = m[2].trim();
    if (/^(["']).*\1$/.test(val)) val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv();
// Windows DNS sometimes refuses SRV lookups — resolve via nslookup instead.
async function ensureResolvable() {
  const uri = process.env.MONGODB_URI;
  if (!uri?.startsWith("mongodb+srv://")) return;
  const { execFileSync } = await import("node:child_process");
  const m = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)\/?([^?]*)(\?.*)?$/);
  if (!m) throw new Error("Unrecognized MONGODB_URI format");
  const [, userinfo, host, db, query] = m;
  const srvOut = execFileSync("nslookup", ["-type=SRV", `_mongodb._tcp.${host}`], { encoding: "utf-8" });
  const hosts = [...srvOut.matchAll(/svr hostname\s*=\s*(\S+)/g)].map((x) => `${x[1]}:27017`);
  if (!hosts.length) return;
  const txtOut = execFileSync("nslookup", ["-type=TXT", host], { encoding: "utf-8" });
  const txt = txtOut.match(/"([^"]+)"/)?.[1] ?? "";
  const params = new URLSearchParams((query ?? "?").replace(/^\?/, ""));
  params.set("ssl", "true");
  process.env.MONGODB_URI = `mongodb://${userinfo}@${hosts.join(",")}/${db}?${txt}&${params.toString()}`;
}

async function main() {
  await ensureResolvable();
  const { connectToDatabase } = await import("@/lib/db");
  const { Exercise } = await import("@/models/Exercise");
  await connectToDatabase();
  let updated = 0;
  const missing: string[] = [];
  for (const [externalId, x] of Object.entries(CONTENT)) {
    const r = await Exercise.updateOne(
      { importSource: "fitxnet", externalId },
      { $set: { description: x.d, instructions: x.i, commonMistakes: x.m, coachTips: x.t } },
    );
    if (r.matchedCount) updated++;
    else missing.push(externalId);
  }
  const total = await Exercise.countDocuments({ importSource: "fitxnet" });
  console.log(`Updated ${updated} of ${total} fitxnet exercises`);
  if (missing.length) console.log("Not found:", missing);
  const mongoose = (await import("mongoose")).default;
  await mongoose.connection.close();
  process.exit(missing.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });

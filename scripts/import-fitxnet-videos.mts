/**
 * Uploads the coach's own Fitxnet exercise videos (watermarked "Fitxnet.com")
 * to Cloudinary and adds them to the library as system exercises.
 * Idempotent: keyed by (importSource="fitxnet", externalId=<folder>/<file>),
 * already-imported videos are skipped.
 *
 * Run with: npx tsx scripts/import-fitxnet-videos.mts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

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

const SRC = resolve(process.cwd(), "تمارين fitxnet - علامة Fitxnet");
const FOLDER = "ahmed-emad/system/exercises";
const SOURCE = "fitxnet";

type Cat = "chest" | "back" | "shoulders" | "legs" | "glutes";
const FOLDERS: Record<string, { category: Cat; muscles: string[] }> = {
  "صدر": { category: "chest", muscles: ["chest"] },
  "ظهر": { category: "back", muscles: ["lats", "middle back"] },
  "كتف": { category: "shoulders", muscles: ["shoulders"] },
  "رجل أمامية": { category: "legs", muscles: ["quadriceps"] },
  "رجل خلفية": { category: "legs", muscles: ["hamstrings"] },
  "سمانة": { category: "legs", muscles: ["calves"] },
  "مؤخرة": { category: "glutes", muscles: ["glutes"] },
};

const EN: Record<string, string> = {
  "ديدلفت بالبار": "Barbell Deadlift",
  "تجديف بالبار 1": "Barbell Bent-Over Row",
  "تجديف بالبار 2": "Barbell Bent-Over Row (Variation)",
  "رفرفة خلفي بالدمبل": "Dumbbell Rear Delt Fly",
  "تجديف معكوس على العقلة": "Inverted Row",
  "تجديف T-bar": "T-Bar Row",
  "ضغط على الركب": "Knee Push-Up",
  "تجديف دمبل بذراع واحدة": "One-Arm Dumbbell Row",
  "سحب أمامي بالكابل": "Lat Pulldown",
  "تجديف دمبل على بنش مائل": "Incline Bench Dumbbell Row",
  "سحب كابل بذراع واحدة": "Single-Arm Cable Pulldown",
  "سحب أمامي واسع": "Wide-Grip Lat Pulldown",
  "جلوس على الحائط": "Wall Sit",
  "عقلة": "Pull-Up",
  "ركلة خلفية على الأربع": "Donkey Kick",
  "سومو سكوات بالدمبل": "Dumbbell Sumo Squat",
  "ديدلفت بالبار للأرجل": "Barbell Deadlift (Legs)",
  "صعود على البنش": "Bench Step-Up",
  "رومانيان ديدلفت برجل واحدة": "Single-Leg Romanian Deadlift",
  "رفع سمانة واقف": "Standing Calf Raise",
  "ليج كيرل واقف": "Standing Leg Curl",
  "ليج اكستنشن": "Leg Extension",
  "ليج كيرل نايم": "Lying Leg Curl",
  "رومانيان ديدلفت بالبار": "Barbell Romanian Deadlift",
  "رفع سمانة جالس بالطارة": "Seated Plate Calf Raise",
  "هاك سكوات": "Hack Squat",
  "طعن": "Lunge",
  "بلغاري سبليت سكوات": "Bulgarian Split Squat",
  "ليج برس": "Leg Press",
  "سكوات بوزن الجسم": "Bodyweight Squat",
  "فرونت سكوات": "Barbell Front Squat",
  "باك سكوات": "Barbell Back Squat",
  "ضغط مائل على البنش": "Incline Push-Up",
  "جوبلت سكوات": "Goblet Squat",
  "ضغط بأيدي واسعة": "Wide Push-Up",
  "ضغط عادي": "Push-Up",
  "بيك ديك": "Pec Deck Fly",
  "ضغط مقلوب والرجل على البنش": "Decline Push-Up",
  "تفتيح صدر بالماكينة": "Machine Chest Fly",
  "ضغط 2": "Push-Up (Variation)",
  "كروس اوفر عالي": "High Cable Crossover",
  "تفتيح دمبل مستوي": "Flat Dumbbell Fly",
  "ضغط دمبل مستوي بقبضة ضيقة": "Close-Grip Dumbbell Press",
  "ضغط دمبل عالي": "Incline Dumbbell Press",
  "بنش برس عالي بالبار": "Incline Barbell Bench Press",
  "كروس اوفر سفلي": "Low Cable Crossover",
  "بنش برس مستوي بالبار": "Barbell Bench Press",
};

async function upload(path: string, publicId: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = { folder: FOLDER, overwrite: "true", public_id: publicId, timestamp };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", key);
  form.append("signature", createHash("sha1").update(toSign + secret).digest("hex"));
  form.append("file", new Blob([readFileSync(path)], { type: "video/mp4" }));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/video/upload`, { method: "POST", body: form });
  const body = (await res.json()) as { secure_url?: string; public_id?: string; error?: { message: string } };
  if (!res.ok || !body.secure_url) throw new Error(body.error?.message ?? `HTTP ${res.status}`);
  return { url: body.secure_url, publicId: body.public_id! };
}

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

  let added = 0, skipped = 0, failed = 0;
  for (const dir of readdirSync(SRC)) {
    const meta = FOLDERS[dir];
    if (!meta) { console.warn(`Unknown folder: ${dir}`); continue; }
    for (const file of readdirSync(join(SRC, dir)).filter((f) => f.endsWith(".mp4"))) {
      const nameAr = file.replace(/\.mp4$/, "");
      const nameEn = EN[nameAr];
      const externalId = `${dir}/${nameAr}`;
      if (!nameEn) { console.warn(`No English name: ${externalId}`); failed++; continue; }
      if (await Exercise.exists({ importSource: SOURCE, externalId })) { skipped++; continue; }
      try {
        const slug = "fitxnet-" + nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const { url, publicId } = await upload(join(SRC, dir, file), slug);
        await Exercise.create({
          nameAr, nameEn, category: meta.category, targetMuscles: meta.muscles,
          videoUrl: url, videoPublicId: publicId,
          isSystemExercise: true, createdByCoach: null,
          importSource: SOURCE, externalId,
        });
        added++;
        console.log(`✓ ${externalId} → ${nameEn}`);
      } catch (e) {
        failed++;
        console.error(`✗ ${externalId}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }
  console.log(`\nAdded ${added}, skipped ${skipped}, failed ${failed}`);
  const mongoose = (await import("mongoose")).default;
  await mongoose.connection.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });

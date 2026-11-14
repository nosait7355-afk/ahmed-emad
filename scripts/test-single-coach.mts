/**
 * Single-trainer mode checks, run against a throwaway in-memory MongoDB:
 *
 *   npx tsx scripts/test-single-coach.mts
 *
 * Verifies that admin-created coaches are permanent and unlimited, that the
 * first one becomes the primary coach, and that legacy trial coaches can be
 * converted.
 */
process.env.MONGOMS_DOWNLOAD_DIR ||= "G:\\mongo-memory-server-cache\\binaries";
process.env.TEMP = "G:\\mongo-memory-server-cache\\tmp";
process.env.TMP = "G:\\mongo-memory-server-cache\\tmp";

const { MongoMemoryServer } = await import("mongodb-memory-server");
const mem = await MongoMemoryServer.create({ instance: { launchTimeout: 120_000 } });
process.env.MONGODB_URI = mem.getUri();
process.env.MONGODB_DB = "single_coach_test";

const mongoose = (await import("mongoose")).default;
const { User } = await import("@/models/User");
const { Settings } = await import("@/models/Settings");
const svc = await import("@/lib/services/coach-account");
const { syncCoachStatus } = await import("@/lib/services/subscription");
const { assertClientLimit } = await import("@/lib/services/clients");
const { coachCanWrite } = await import("@/lib/permissions");

let failed = 0;
function check(name: string, cond: unknown) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failed++;
}

try {
  await (await import("@/lib/db")).connectToDatabase();
  await Settings.create({ key: "global" });
  check("no primary coach before any coach exists", (await svc.getPrimaryCoachId()) === null);

  const first = await svc.createCoachAccount({ name: "Ahmed Emad", username: "Ahmed", password: "Passw0rd!", email: "A@x.com" });
  check("first coach becomes primary", first.isPrimary && (await svc.getPrimaryCoachId()) === first.coachId);

  const doc = await User.findById(first.coachId).lean();
  check("username/email are normalized", doc?.username === "ahmed" && doc?.email === "a@x.com");
  check("status is active", doc?.status === "active");
  check("no trial end date", !doc?.coachProfile?.trialEndDate);
  check("no subscription end date", doc?.coachProfile?.subscriptionEndDate == null);
  check("unlimited clients (maxClients 0)", doc?.coachProfile?.maxClients === 0);
  check("unlimited team (maxTeamMembers unset)", doc?.coachProfile?.maxTeamMembers === undefined);
  check("sync keeps status active", (await syncCoachStatus(first.coachId)) === "active");
  check("coach can write", coachCanWrite(await syncCoachStatus(first.coachId)));

  let limitOk = true;
  try {
    await assertClientLimit(first.coachId, 10_000);
  } catch {
    limitOk = false;
  }
  check("no client limit (10,000 new clients allowed)", limitOk);

  const second = await svc.createCoachAccount({ name: "Second", username: "second", password: "Passw0rd!" });
  check("second coach is not primary", !second.isPrimary && (await svc.getPrimaryCoachId()) === first.coachId);

  let dupCode = "";
  try {
    await svc.createCoachAccount({ name: "Dup", username: "AHMED", password: "Passw0rd!" });
  } catch (e) {
    dupCode = (e as { code?: string }).code ?? "";
  }
  check("duplicate username rejected", dupCode === "USERNAME_TAKEN");

  dupCode = "";
  try {
    await svc.createCoachAccount({ name: "Dup", username: "other", email: "a@X.com", password: "Passw0rd!" });
  } catch (e) {
    dupCode = (e as { code?: string }).code ?? "";
  }
  check("duplicate email rejected", dupCode === "EMAIL_TAKEN");

  await svc.setPrimaryCoach(second.coachId);
  check("primary coach can be switched", (await svc.getPrimaryCoachId()) === second.coachId);

  await User.deleteOne({ _id: second.coachId });
  check("deleted primary coach resolves to null", (await svc.getPrimaryCoachId()) === null);

  // Legacy trial coach whose trial already ended.
  const legacy = await User.create({
    name: "Legacy",
    username: "legacy",
    passwordHash: "x",
    role: "coach",
    status: "trial",
    coachProfile: {
      subscriptionStatus: "trial",
      trialEndDate: new Date(Date.now() - 86_400_000),
      subscriptionEndDate: new Date(Date.now() - 86_400_000),
      maxClients: 10,
      maxTeamMembers: 0,
    },
  });
  check("legacy lapsed trial is expired", (await syncCoachStatus(String(legacy._id))) === "expired");
  await svc.makeCoachPermanent(String(legacy._id));
  const fixed = await User.findById(legacy._id).lean();
  check(
    "makeCoachPermanent clears trial, end date and limits",
    fixed?.status === "active" &&
      !fixed.coachProfile?.trialEndDate &&
      fixed.coachProfile?.subscriptionEndDate == null &&
      fixed.coachProfile?.maxClients === 0 &&
      fixed.coachProfile?.maxTeamMembers === undefined,
  );
  check("converted coach stays active after sync", (await syncCoachStatus(String(legacy._id))) === "active");
} finally {
  await mongoose.disconnect();
  await mem.stop();
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
process.exit(failed ? 1 : 0);

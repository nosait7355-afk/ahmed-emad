/**
 * Exercise library permissions in single-trainer mode, against a throwaway
 * in-memory MongoDB:
 *
 *   npx tsx scripts/test-exercise-permissions.mts
 */
process.env.MONGOMS_DOWNLOAD_DIR ||= "G:\\mongo-memory-server-cache\\binaries";
process.env.TEMP = "G:\\mongo-memory-server-cache\\tmp";
process.env.TMP = "G:\\mongo-memory-server-cache\\tmp";

const { MongoMemoryServer } = await import("mongodb-memory-server");
const mem = await MongoMemoryServer.create({ instance: { launchTimeout: 120_000 } });
process.env.MONGODB_URI = mem.getUri();
process.env.MONGODB_DB = "ae_exercise_perms_test";

const mongoose = (await import("mongoose")).default;
const { Settings } = await import("@/models/Settings");
const { PermissionError } = await import("@/lib/permissions");
const coachSvc = await import("@/lib/services/coach-account");
const ex = await import("@/lib/services/exercises");

let failed = 0;
function check(name: string, cond: unknown) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failed++;
}
async function forbidden(fn: () => Promise<unknown>) {
  try {
    await fn();
    return false;
  } catch (e) {
    return e instanceof PermissionError;
  }
}
const data = (name: string) => ({ nameAr: name, nameEn: name, category: "chest", targetMuscles: [], gifUrl: "", youtubeUrl: "" });

try {
  await (await import("@/lib/db")).connectToDatabase();
  await Settings.create({ key: "global" });
  const { coachId: A } = await coachSvc.createCoachAccount({ name: "Ahmed", username: "ahmed", password: "Passw0rd!" });
  const { coachId: B } = await coachSvc.createCoachAccount({ name: "Other", username: "other", password: "Passw0rd!" });
  const coachA = { role: "coach" as const, coachId: A };
  const coachB = { role: "coach" as const, coachId: B };
  const admin = { role: "super_admin" as const };

  const sys1 = await ex.createExercise(admin, data("System 1"));
  const sys2 = await ex.createExercise(admin, data("System 2"));
  const mineA = await ex.createExercise(coachA, data("Mine A"));

  // The first coach account becomes the primary coach automatically.
  check("first coach is the primary coach", (await coachSvc.getPrimaryCoachId()) === A);
  // Switching the primary coach moves library rights with it.
  await coachSvc.setPrimaryCoach(B);
  check("non-primary coach cannot edit a system exercise", await forbidden(() => ex.updateExercise(sys1, coachA, data("x"))));
  await coachSvc.setPrimaryCoach(A);
  check("primary coach is reported as able to edit the library", await ex.coachCanEditSystemExercises(A));
  check("other coach is not", !(await ex.coachCanEditSystemExercises(B)));

  check("primary coach can edit a system exercise", await ex.updateExercise(sys1, coachA, data("Edited")));
  check("the edit is saved and it stays a system exercise", (await ex.getExercise(sys1, admin))?.nameEn === "Edited");
  check("primary coach can delete a system exercise", await ex.deleteExercise(sys2, coachA));
  check("the deleted exercise is gone", (await ex.getExercise(sys2, admin)) === null);
  check("primary coach can still edit their own exercise", await ex.updateExercise(mineA, coachA, data("Mine A2")));

  check("other coach cannot edit a system exercise", await forbidden(() => ex.updateExercise(sys1, coachB, data("x"))));
  check("other coach cannot delete a system exercise", await forbidden(() => ex.deleteExercise(sys1, coachB)));
  check("other coach cannot delete the primary coach's exercise", await forbidden(() => ex.deleteExercise(mineA, coachB)));
  check("admin still cannot edit a coach's own exercise", await forbidden(() => ex.updateExercise(mineA, admin, data("x"))));
  check("missing exercise returns false", (await ex.deleteExercise(new mongoose.Types.ObjectId().toString(), coachA)) === false);
} finally {
  await mongoose.disconnect();
  await mem.stop();
}

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);

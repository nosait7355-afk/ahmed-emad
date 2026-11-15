/**
 * Client sign-up + packages checks, run against a throwaway in-memory MongoDB:
 *
 *   npx tsx scripts/test-client-signup.mts
 */
process.env.MONGOMS_DOWNLOAD_DIR ||= "G:\\mongo-memory-server-cache\\binaries";
process.env.TEMP = "G:\\mongo-memory-server-cache\\tmp";
process.env.TMP = "G:\\mongo-memory-server-cache\\tmp";

const { MongoMemoryServer } = await import("mongodb-memory-server");
const mem = await MongoMemoryServer.create({ instance: { launchTimeout: 120_000 } });
process.env.MONGODB_URI = mem.getUri();
process.env.MONGODB_DB = "client_signup_test";

const mongoose = (await import("mongoose")).default;
const { User } = await import("@/models/User");
const { Settings } = await import("@/models/Settings");
const { Notification } = await import("@/models/Notification");
const coachSvc = await import("@/lib/services/coach-account");
const pkgSvc = await import("@/lib/services/coaching-packages");
const signup = await import("@/lib/services/client-signup");
const { getClientAccessState } = await import("@/lib/services/subscription");
const { listClients, coachClientStats, deleteClient } = await import("@/lib/services/clients");
const { clientRegisterSchema, packageSchema } = await import("@/lib/validations/client-signup");

let failed = 0;
function check(name: string, cond: unknown) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failed++;
}
async function codeOf(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
    return "";
  } catch (e) {
    return (e as { code?: string }).code ?? "THREW";
  }
}

const base = {
  name: "Mona Ali",
  username: "Mona",
  phone: "+201012345678",
  password: "Passw0rd!",
  gender: "female" as const,
  height: 165,
  weight: 70,
  goal: "fat_loss" as const,
};

try {
  await (await import("@/lib/db")).connectToDatabase();
  await Settings.create({ key: "global" });

  // ---- No primary coach yet ----
  check(
    "sign-up is closed without a primary coach",
    (await codeOf(() => signup.registerClientAccount({ ...base, packageId: "x" }))) === "SIGNUP_CLOSED",
  );

  const { coachId } = await coachSvc.createCoachAccount({ name: "Ahmed Emad", username: "ahmed", password: "Passw0rd!" });

  // ---- Packages ----
  await pkgSvc.ensureDefaultPackages(coachId);
  await pkgSvc.ensureDefaultPackages(coachId);
  let packages = await pkgSvc.listPackages(coachId);
  check("default packages are seeded once (5)", packages.length === 5);
  const p1 = packages.find((p) => p.months === 1 && p.price === 499)!;
  const p3 = packages.find((p) => p.months === 3)!;
  check("1-month package: 499 EGP, was 1,000", p1?.price === 499 && p1.originalPrice === 1000);
  check("3-month package is the popular one at 1,499", p3?.popular && p3.price === 1499);
  check("VIP is seeded as a 1-month package", packages.some((p) => p.name.ar === "VIP" && p.months === 1));

  const newId = await pkgSvc.createPackage(coachId, {
    nameAr: "شهرين",
    nameEn: "2 Months",
    months: 2,
    price: 900,
    originalPrice: 800, // not above price → dropped
    featuresAr: ["ميزة ١", "ميزة ٢"],
    featuresEn: ["Feature 1"],
    popular: true,
    isActive: true,
  });
  packages = await pkgSvc.listPackages(coachId);
  const created = packages.find((p) => p.id === newId)!;
  check("new package is appended last", packages[packages.length - 1].id === newId);
  check("original price not above price is dropped", created.originalPrice === null);
  check("features keep both languages per line", created.features.length === 2 && created.features[0].en === "Feature 1");
  check("only one package is popular", packages.filter((p) => p.popular).length === 1 && created.popular);

  await pkgSvc.movePackage(coachId, newId, -1);
  packages = await pkgSvc.listPackages(coachId);
  check("move up changes the order", packages[packages.length - 2].id === newId);

  await pkgSvc.updatePackage(coachId, p1.id, {
    nameAr: p1.name.ar,
    nameEn: p1.name.en,
    months: 1,
    price: 600,
    originalPrice: 1000,
    featuresAr: [],
    featuresEn: [],
    popular: false,
    isActive: false,
  });
  check("hidden package is not offered", !(await pkgSvc.listPackages(coachId, { activeOnly: true })).some((p) => p.id === p1.id));
  check("hidden package can't be chosen", (await pkgSvc.getActivePackage(coachId, p1.id)) === null);

  const other = await coachSvc.createCoachAccount({ name: "Other", username: "other", password: "Passw0rd!" });
  check("another coach can't edit the package", !(await pkgSvc.deletePackage(other.coachId, p3.id)));

  // ---- Sign-up ----
  check(
    "hidden package is rejected at sign-up",
    (await codeOf(() => signup.registerClientAccount({ ...base, packageId: p1.id }))) === "PACKAGE_UNAVAILABLE",
  );

  const { clientId } = await signup.registerClientAccount({ ...base, email: "Mona@X.com", packageId: p3.id });
  const doc = await User.findById(clientId).lean();
  check("client is attached to the primary coach", String(doc?.clientProfile?.coach) === coachId);
  check("username and email are normalized", doc?.username === "mona" && doc?.email === "mona@x.com");
  check("client starts pending", doc?.clientProfile?.signupStatus === "pending");
  check("client gets a client code", /^TRG\d{5}$/.test(doc?.clientProfile?.clientCode ?? ""));
  check(
    "requested package snapshot is stored",
    doc?.clientProfile?.requestedPackage?.price === 1499 && doc.clientProfile.requestedPackage.months === 3,
  );
  check("no subscription dates before activation", !doc?.clientProfile?.subscriptionStartDate && !doc?.clientProfile?.subscriptionEndDate);
  check("password is hashed", !!doc?.passwordHash && doc.passwordHash !== base.password);

  check(
    "duplicate username rejected",
    (await codeOf(() => signup.registerClientAccount({ ...base, username: "MONA", packageId: p3.id }))) === "USERNAME_TAKEN",
  );
  check(
    "duplicate email rejected",
    (await codeOf(() => signup.registerClientAccount({ ...base, username: "mona2", email: "mona@x.com", packageId: p3.id }))) === "EMAIL_TAKEN",
  );

  check("pending client is locked out", (await getClientAccessState(clientId)).frozen === true);
  check("pending client is not in the coach's client list", (await listClients(coachId)).length === 0);
  check("pending client is not counted in stats", (await coachClientStats(coachId)).total === 0);
  check("pending client shows in the requests inbox", (await signup.listSignupRequests(coachId)).length === 1);
  check("requests count is 1", (await signup.countSignupRequests(coachId)) === 1);
  check("other coach sees no requests", (await signup.listSignupRequests(other.coachId)).length === 0);
  check(
    "coach is notified of the request",
    (await Notification.countDocuments({ recipient: coachId, type: "new_client", link: "/coach/requests" })) === 1,
  );
  const state = await signup.getSignupState(clientId);
  check("waiting screen state: pending with package", state?.pending === true && state.package?.price === 1499);

  // ---- Activation ----
  check(
    "another coach can't activate the request",
    (await codeOf(() => signup.activateSignup(other.coachId, clientId))) === "NOT_FOUND",
  );

  const before = Date.now();
  const { endDate } = await signup.activateSignup(coachId, clientId);
  const months = (endDate.getFullYear() - new Date(before).getFullYear()) * 12 + endDate.getMonth() - new Date(before).getMonth();
  check("activation grants the requested 3 months", months === 3);
  const active = await User.findById(clientId).lean();
  check("client is approved with dates", active?.clientProfile?.signupStatus === "approved" && !!active.clientProfile.subscriptionStartDate);
  check("active client has access", (await getClientAccessState(clientId)).frozen === false);
  check("active client appears in the client list", (await listClients(coachId)).length === 1);
  check("requests inbox is empty after activation", (await signup.countSignupRequests(coachId)) === 0);
  check(
    "client is notified of activation",
    (await Notification.countDocuments({ recipient: clientId, type: "subscription_activated" })) === 1,
  );
  check("waiting screen state: no longer pending", (await signup.getSignupState(clientId))?.pending === false);
  check("activating twice is rejected", (await codeOf(() => signup.activateSignup(coachId, clientId))) === "NOT_FOUND");

  // Activate a second client on a different package than requested.
  const second = await signup.registerClientAccount({ ...base, username: "omar", gender: "male", packageId: p3.id });
  const twoMonth = await signup.activateSignup(coachId, second.clientId, { packageId: newId });
  const m2 = (twoMonth.endDate.getFullYear() - new Date().getFullYear()) * 12 + twoMonth.endDate.getMonth() - new Date().getMonth();
  const secondDoc = await User.findById(second.clientId).lean();
  check("coach can activate on a different package (2 months)", m2 === 2 && secondDoc?.clientProfile?.requestedPackage?.price === 900);

  // Decline = delete the pending account.
  const third = await signup.registerClientAccount({ ...base, username: "sara", packageId: p3.id });
  check("declining removes the pending account", (await deleteClient(coachId, third.clientId)) && !(await User.exists({ _id: third.clientId })));

  // ---- Validation ----
  const form = { ...base, email: "", confirmPassword: base.password, packageId: p3.id, age: "", height: "175", weight: "80" };
  const ok = clientRegisterSchema.safeParse(form);
  check("form accepts string numbers and an empty age", ok.success && ok.data.height === 175 && ok.data.age === undefined);
  check("mismatched passwords are rejected", !clientRegisterSchema.safeParse({ ...form, confirmPassword: "nope" }).success);
  check("height in metres is rejected", !clientRegisterSchema.safeParse({ ...form, height: "1.75" }).success);
  check("missing goal is rejected", !clientRegisterSchema.safeParse({ ...form, goal: undefined }).success);
  check("package form rejects 0 months", !packageSchema.safeParse({ nameAr: "x", months: 0, price: 10 }).success);
} finally {
  await mongoose.disconnect();
  await mem.stop();
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
process.exit(failed ? 1 : 0);

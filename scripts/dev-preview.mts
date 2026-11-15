/**
 * Preview launcher: spins up an in-memory MongoDB, seeds one user per role,
 * then runs the app against it. For local previews/screenshots
 * without provisioning a real database. Not used in production.
 */
import { spawn } from "node:child_process";

// The C: drive can run low on space, which corrupts the ~800MB mongod
// download/extraction (truncated .exe -> "not a valid application for this
// OS platform" / spawn EFTYPE). Redirect the binary cache and temp dbPath to
// a drive with room before mongodb-memory-server touches os.tmpdir().
process.env.MONGOMS_DOWNLOAD_DIR ||= "G:\\mongo-memory-server-cache\\binaries";
process.env.TEMP = "G:\\mongo-memory-server-cache\\tmp";
process.env.TMP = "G:\\mongo-memory-server-cache\\tmp";

async function main() {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  // A cold mongod start on Windows can take well over the 10s default.
  const mem = await MongoMemoryServer.create({ instance: { launchTimeout: 120_000 } });
  const uri = mem.getUri();
  process.env.MONGODB_URI = uri;
  process.env.MONGODB_DB = "ae_preview";

  const { connectToDatabase } = await import("@/lib/db");
  const { User } = await import("@/models/User");
  const { hashPassword } = await import("@/lib/auth/password");
  const { TRIAL_DURATION_DAYS } = await import("@/lib/constants");

  await connectToDatabase();

  // Seed admin + plans + settings + starter libraries (exercises/foods/templates).
  process.env.SEED_ADMIN_USERNAME = "admin";
  process.env.SEED_ADMIN_PASSWORD = "Admin123!";
  process.env.SEED_ADMIN_EMAIL = "admin@example.com";
  const { seedAll } = await import("@/lib/seed");
  await seedAll(() => {});

  const now = Date.now();
  const coach = await User.create({
    name: "Ahmed Hassan",
    username: "coach",
    email: "coach@example.com",
    phone: "21028676395",
    passwordHash: await hashPassword("Coach123!"),
    role: "coach",
    status: "trial",
    locale: "ar",
    coachProfile: {
      brandName: "Ahmed Fitness",
      whatsappNumber: "201234567890",
      trialStartDate: new Date(now),
      trialEndDate: new Date(now + TRIAL_DURATION_DAYS * 86_400_000),
      subscriptionStatus: "trial",
      maxClients: 0,
    },
  });

  // Single-trainer mode: the preview coach is permanent and receives public
  // sign-ups; one pending sign-up is seeded so the requests inbox and the
  // client waiting screen have something to show.
  const coachId = String(coach._id);
  const { makeCoachPermanent, setPrimaryCoach } = await import("@/lib/services/coach-account");
  const { ensureDefaultPackages, listPackages } = await import("@/lib/services/coaching-packages");
  const { registerClientAccount } = await import("@/lib/services/client-signup");
  await makeCoachPermanent(coachId);
  await setPrimaryCoach(coachId);
  await ensureDefaultPackages(coachId);
  const [firstPackage] = await listPackages(coachId, { activeOnly: true });
  await registerClientAccount({
    name: "Youssef Adel",
    username: "pending",
    phone: "+201001234567",
    password: "Client123!",
    gender: "male",
    age: 27,
    height: 178,
    weight: 84,
    goal: "fat_loss",
    packageId: firstPackage.id,
  });

  await User.create({
    name: "Sara Mohamed",
    username: "client",
    passwordHash: await hashPassword("Client123!"),
    role: "client",
    status: "active",
    locale: "ar",
    mustChangePassword: true,
    clientProfile: { coach: coach._id, clientCode: "TRG90001", active: true },
  });

  // Second client with a near-expiry subscription, for testing the countdown
  // banner — and no forced password change so the rest of the app is usable.
  await User.create({
    name: "Mona Khaled",
    username: "client2",
    passwordHash: await hashPassword("Client123!"),
    role: "client",
    status: "active",
    locale: "ar",
    mustChangePassword: false,
    clientProfile: {
      coach: coach._id,
      clientCode: "TRG90002",
      active: true,
      subscriptionStartDate: new Date(now - 27 * 86_400_000),
      subscriptionEndDate: new Date(now + 2 * 86_400_000),
    },
  });

  console.log("\n✓ In-memory MongoDB seeded:");
  console.log(`  admin  / Admin123!   (super_admin)`);
  console.log(`  coach  / Coach123!   (${coach.role})`);
  console.log(`  client / Client123!  (client)`);
  console.log(`  client2 / Client123! (client, expiring in 2 days)`);
  console.log(`  pending / Client123! (client, signed up, waiting for activation)\n`);
  console.log(`MONGODB_URI=${uri}\n`);

  // Hot-reload dev server by default; PREVIEW_MODE=start serves the production
  // build instead (run `npm run build` first).
  const mode = process.env.PREVIEW_MODE === "start" ? "start" : "dev";
  const child = spawn("npx", ["next", mode, "-p", "3000"], {
    env: { ...process.env, MONGODB_URI: uri, MONGODB_DB: "ae_preview" },
    stdio: "inherit",
    shell: true,
  });

  const shutdown = () => {
    child.kill();
    mem.stop().finally(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

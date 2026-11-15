import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import { SignupClosed } from "./signup-closed";
import { getPrimaryCoachId } from "@/lib/services/coach-account";
import { ensureDefaultPackages, listPackages, type PackageDTO } from "@/lib/services/coaching-packages";

export const metadata: Metadata = {
  title: "ابدأ اشتراكك",
};

// Packages and the primary coach are read live so price edits show immediately.
export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: preselected } = await searchParams;
  // If the database is unreachable, show the WhatsApp fallback instead of
  // crashing the page.
  let packages: PackageDTO[] = [];
  try {
    const coachId = await getPrimaryCoachId();
    if (coachId) {
      await ensureDefaultPackages(coachId);
      packages = await listPackages(coachId, { activeOnly: true });
    }
  } catch (e) {
    console.error("[register] could not load packages:", e);
  }
  if (packages.length === 0) return <SignupClosed />;

  return <RegisterForm packages={packages} preselectedPackageId={preselected} />;
}

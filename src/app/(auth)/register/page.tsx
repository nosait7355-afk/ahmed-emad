import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import { SignupClosed } from "./signup-closed";
import { getPrimaryCoachId } from "@/lib/services/coach-account";
import { ensureDefaultPackages, listPackages } from "@/lib/services/coaching-packages";

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
  const coachId = await getPrimaryCoachId();
  if (!coachId) return <SignupClosed />;

  await ensureDefaultPackages(coachId);
  const packages = await listPackages(coachId, { activeOnly: true });
  if (packages.length === 0) return <SignupClosed />;

  return <RegisterForm packages={packages} preselectedPackageId={preselected} />;
}

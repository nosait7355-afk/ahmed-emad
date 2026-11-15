import { requireCoachArea } from "@/lib/auth/session";
import { canManageSubscriptions } from "@/lib/permissions/team";
import { coachCanWrite } from "@/lib/permissions";
import { ensureDefaultPackages, listPackages } from "@/lib/services/coaching-packages";
import { PackagesView } from "./packages-view";

export const dynamic = "force-dynamic";

export default async function CoachPackagesPage() {
  const ctx = await requireCoachArea(canManageSubscriptions);
  await ensureDefaultPackages(ctx.coachId);
  const packages = await listPackages(ctx.coachId);
  return <PackagesView packages={packages} canWrite={coachCanWrite(ctx.status)} />;
}

import { requireRole } from "@/lib/auth/session";
import { listCoaches } from "@/lib/services/admin";
import { getPrimaryCoachId } from "@/lib/services/coach-account";
import { CoachesView, type CoachRow } from "./coaches-view";
import type { AccountStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminCoachesPage() {
  await requireRole("super_admin");
  const [rawCoaches, primaryCoachId] = await Promise.all([listCoaches(), getPrimaryCoachId()]);

  const coaches: CoachRow[] = rawCoaches.map((c) => {
    const cp = (c.coachProfile ?? {}) as Record<string, unknown>;
    const isTrial = cp.subscriptionStatus === "trial" || (!cp.subscriptionStatus && c.status === "trial");
    const endDate = isTrial
      ? (cp.trialEndDate ? String(cp.trialEndDate) : null)
      : (cp.subscriptionEndDate ? String(cp.subscriptionEndDate) : null);
    return {
      id: String(c._id),
      name: c.name,
      email: c.email ?? "",
      brand: cp.brandName as string | undefined,
      isPrimary: String(c._id) === primaryCoachId,
      clients: (c as { clientCount?: number }).clientCount ?? 0,
      status: c.status as AccountStatus,
      endDate,
      suspendedByAdmin: Boolean(cp.suspendedByAdmin),
    };
  });

  return <CoachesView coaches={coaches} />;
}

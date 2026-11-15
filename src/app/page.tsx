import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homePathForRole } from "@/lib/permissions";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Landing } from "@/components/marketing/landing";
import { getPrimaryCoachId } from "@/lib/services/coach-account";
import { ensureDefaultPackages, listPackages, type PackageDTO } from "@/lib/services/coaching-packages";
import { PACKAGES } from "@/config/site-content";

/** Static fallback used until a primary coach exists (or if the database is unreachable). */
function fallbackPackages(): PackageDTO[] {
  return PACKAGES.map((p, i) => ({
    id: "",
    name: p.duration,
    tagline: p.tagline,
    months: p.months ?? 1,
    price: p.price,
    originalPrice: p.originalPrice > p.price ? p.originalPrice : null,
    features: p.features,
    popular: Boolean(p.popular),
    isActive: true,
    sortOrder: i,
  }));
}

/** Live packages from the coach's dashboard, so price edits show on the site. */
async function loadPackages(): Promise<PackageDTO[]> {
  try {
    const coachId = await getPrimaryCoachId();
    if (!coachId) return fallbackPackages();
    await ensureDefaultPackages(coachId);
    const live = await listPackages(coachId, { activeOnly: true });
    return live.length > 0 ? live : fallbackPackages();
  } catch {
    return fallbackPackages();
  }
}

export default async function HomePage() {
  // Signed-in users get their dashboard, not the marketing page — otherwise the
  // home route looks "logged out" even with a valid session. Reading the session
  // makes this route dynamic (no static cache), which is what we want here.
  const session = await auth();
  if (session?.user) redirect(homePathForRole(session.user.role));

  const packages = await loadPackages();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Landing packages={packages} />
      </div>
      <SiteFooter />
    </div>
  );
}

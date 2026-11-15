import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/brand/language-switcher";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { auth } from "@/lib/auth";
import { homePathForRole } from "@/lib/permissions";
import { AuthHero } from "./auth-hero";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(homePathForRole(session.user.role));
  }

  // Flex row order follows `dir`, so the portrait sits on the start side in
  // both RTL and LTR without extra rules. Each page sets its own max width.
  return (
    <div className="min-h-svh bg-background lg:flex">
      <div className="lg:w-1/2 xl:w-[55%]">
        <AuthHero />
      </div>

      <div className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-background lg:mt-0 lg:min-h-svh lg:rounded-none">
        <header className="flex items-center justify-between px-4 pt-5 sm:px-8 lg:pt-6">
          <Logo />
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

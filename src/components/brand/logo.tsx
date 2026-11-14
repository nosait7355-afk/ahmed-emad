import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";

/** "AHMED EMAD" wordmark: first word in the text color, second in brand red. */
export function BrandText({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("font-extrabold tracking-tight", className)}>
      {BRAND.wordmark.first} <span className="text-primary">{BRAND.wordmark.second}</span>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  showText = true,
  size = "md",
}: {
  className?: string;
  href?: string | null;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { box: 32, text: "text-sm" },
    md: { box: 40, text: "text-base" },
    lg: { box: 52, text: "text-xl" },
  }[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={BRAND.images.logo}
        alt={BRAND.name}
        width={sizes.box}
        height={sizes.box}
        className="shrink-0 rounded-full"
        priority
      />
      {showText && <BrandText className={sizes.text} />}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} className="inline-flex" aria-label={BRAND.name}>
      {content}
    </Link>
  );
}

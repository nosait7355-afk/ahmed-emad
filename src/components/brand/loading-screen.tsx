import Image from "next/image";
import { BRAND } from "@/config/brand";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Image
        src={BRAND.images.logo}
        alt={BRAND.name}
        width={72}
        height={72}
        priority
        className="animate-pulse rounded-full"
      />
      <div className="h-1 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-primary" />
      </div>
    </div>
  );
}

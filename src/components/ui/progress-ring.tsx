import { cn } from "@/lib/utils";

/**
 * Circular progress ring (Activity-style). `value` is 0–100; the centre shows
 * `children` (usually a number and a small caption).
 */
export function ProgressRing({
  value,
  size = 96,
  stroke = 10,
  tone = "primary",
  label,
  children,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "primary" | "success" | "warning" | "destructive";
  /** Accessible description, e.g. "12 of 30 days". */
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = {
    primary: "hsl(var(--primary))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    destructive: "hsl(var(--destructive))",
  }[tone];

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 0.8s var(--ease-out)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
        {children}
      </div>
    </div>
  );
}

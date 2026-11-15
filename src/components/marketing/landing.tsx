"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  MessageCircle,
  MessagesSquare,
  PlayCircle,
  Quote,
  Salad,
  Star,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/components/providers/i18n-provider";
import { BRAND } from "@/config/brand";
import {
  CONTACT,
  CREDENTIALS,
  FAQ,
  GALLERY,
  HERO,
  PILLARS,
  SERVICES,
  STATS,
  SWIMMERS_BUNDLE,
  TESTIMONIALS,
} from "@/config/site-content";
import { cn, formatNumber } from "@/lib/utils";
import type { PackageDTO } from "@/lib/services/coaching-packages";

const SERVICE_ICONS = [PlayCircle, Salad, MessagesSquare];

export function Landing({ packages }: { packages: PackageDTO[] }) {
  const { locale, dir } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const tr = (v: { ar: string; en: string }) => v[locale] || v.ar;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappGreeting[locale])}`;
  const coachName = locale === "ar" ? `كابتن ${BRAND.nameAr}` : `Coach ${BRAND.name}`;

  return (
    <main className="overflow-x-clip">
      {/* ───────── Hero ───────── */}
      <section className="relative -mt-16 pt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_70%_0%,hsl(var(--primary)/0.16),transparent_70%)]"
          aria-hidden
        />
        <div className="container grid items-center gap-10 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="text-center lg:text-start">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm font-medium backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {tr(HERO.eyebrow)}
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-display mt-6">
                {tr(HERO.titleLine1)}
                <br />
                <span className="text-primary">{tr(HERO.titleLine2)}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                {tr(HERO.subtitle)}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/register">
                    {tr(HERO.ctaPrimary)}
                    <Arrow className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/login">{tr(HERO.ctaSecondary)}</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <dl className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 lg:mx-0">
                {STATS.map((s) => (
                  <div key={s.value} className="text-center lg:text-start">
                    <dt className="sr-only">{tr(s.label)}</dt>
                    <dd className="text-3xl font-bold tabular-nums" dir="ltr">{s.value}</dd>
                    <dd className="mt-1 text-sm text-muted-foreground">{tr(s.label)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={40} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_40%,hsl(var(--primary)/0.35),transparent_70%)] blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-elevated">
              <Image
                src={BRAND.images.portrait}
                alt={coachName}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 448px, 92vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/45 p-3 text-white backdrop-blur-xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{coachName}</span>
                  <span className="block text-sm text-white/75">{tr(HERO.badge)}</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pillars marquee — always LTR so the loop direction is stable */}
        <div className="border-y border-border/70 bg-card/50 py-4" dir="ltr" aria-hidden>
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-semibold tracking-[0.2em] text-muted-foreground">
            {[...PILLARS, ...PILLARS, ...PILLARS, ...PILLARS].map((p, i) => (
              <span key={i} className="flex items-center gap-10">
                {p}
                <span className="text-primary">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section id="services" className="scroll-mt-20 py-20 md:py-28">
        <div className="container">
          <SectionHead eyebrow={L("إزاي بنشتغل", "How it works")} title={L("كل اللي محتاجه في مكان واحد", "Everything you need, in one place")} />
          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[i] ?? PlayCircle;
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <article className="lift h-full rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-4xl font-bold text-muted-foreground/25 tabular-nums" dir="ltr">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{tr(s.title)}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{tr(s.desc)}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── About the coach ───────── */}
      <section id="about" className="scroll-mt-20 bg-card/50 py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-4">
            {GALLERY.coach.slice(0, 3).map((src, i) => (
              <div
                key={src}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-border/60 bg-muted",
                  i === 0 ? "row-span-2 aspect-[2/3]" : "aspect-[4/3]",
                )}
              >
                <Image
                  src={src}
                  alt={coachName}
                  fill
                  sizes="(min-width: 1024px) 25vw, 46vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </Reveal>

          <div>
            <Reveal>
              <p className="text-eyebrow">{L("مين الكابتن", "Your coach")}</p>
              <h2 className="text-headline mt-3">{coachName}</h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {CREDENTIALS.map((c, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-lg leading-relaxed">{tr(c)}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {STATS.map((s) => (
                  <div key={s.value} className="rounded-2xl border border-border/60 bg-background p-4 text-center">
                    <div className="text-2xl font-bold tabular-nums sm:text-3xl" dir="ltr">{s.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{tr(s.label)}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Results ───────── */}
      <section id="results" className="scroll-mt-20 py-20 md:py-28">
        <div className="container">
          <SectionHead
            eyebrow={L("نتائج حقيقية", "Real results")}
            title={L("تحوّلات العملاء", "Client transformations")}
            subtitle={L("نتائج فعلية في خلال شهور — بالالتزام والمتابعة الصح.", "Real change in months — with the right commitment and follow-up.")}
          />
        </div>
        <PhotoRail images={GALLERY.transformations} alt={L("نتيجة عميل", "Client result")} hint={L("اسحب لمشاهدة المزيد", "Swipe to see more")} />

        <div className="container mt-20 md:mt-28">
          <SectionHead
            eyebrow={L("بطولات وميداليات", "Medals & titles")}
            title={L("سبّاحون على منصّات التتويج", "Swimmers on the podium")}
            subtitle={L("لاعبون درّبهم الكابتن وحقّقوا ميداليات في بطولات السباحة.", "Athletes coached to medals in swimming championships.")}
          />
        </div>
        <PhotoRail images={GALLERY.swimmers} alt={L("سبّاح مع ميدالياته", "Swimmer with medals")} hint={L("اسحب لمشاهدة المزيد", "Swipe to see more")} />
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="scroll-mt-20 bg-card/50 py-20 md:py-28">
        <div className="container">
          <SectionHead eyebrow={L("الاشتراكات", "Plans")} title={L("اختار اللي يناسبك", "Pick what fits you")} />
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, i) => {
              const discount =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round((1 - p.price / p.originalPrice) * 100)
                  : null;
              return (
                <Reveal key={p.id || i} delay={(i % 3) * 0.07}>
                  <article
                    className={cn(
                      "lift relative flex h-full flex-col rounded-3xl border bg-card p-7 shadow-soft",
                      p.popular ? "border-primary ring-4 ring-primary/10" : "border-border/60",
                    )}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 start-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        <Star className="h-3 w-3 fill-current" />
                        {L("الأكثر اختياراً", "Most chosen")}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold">{tr(p.name)}</h3>
                    {tr(p.tagline) && <p className="mt-1 text-sm text-muted-foreground">{tr(p.tagline)}</p>}

                    <div className="mt-6 flex items-end gap-2">
                      <span className="text-5xl font-bold tabular-nums leading-none">{formatNumber(p.price, locale)}</span>
                      <span className="pb-1 text-sm text-muted-foreground">{L("ج.م", "EGP")}</span>
                    </div>
                    {discount != null && p.originalPrice && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground line-through">{formatNumber(p.originalPrice, locale)}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {L(`خصم ${discount}%`, `Save ${discount}%`)}
                        </span>
                      </div>
                    )}

                    <ul className="mt-6 flex-1 space-y-3 text-sm">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                          <span>{tr(f)}</span>
                        </li>
                      ))}
                    </ul>

                    <Button asChild size="lg" variant={p.popular ? "default" : "outline"} className="mt-8 w-full">
                      <Link href={p.id ? `/register?package=${p.id}` : "/register"}>{L("اشترك", "Subscribe")}</Link>
                    </Button>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {SWIMMERS_BUNDLE.comingSoon && (
            <Reveal className="mx-auto mt-8 max-w-6xl">
              <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-border bg-background p-7 md:flex-row md:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Waves className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{tr(SWIMMERS_BUNDLE.title)}</h3>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {L("قريبًا", "Coming soon")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tr(SWIMMERS_BUNDLE.desc)}</p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section id="testimonials" className="scroll-mt-20 py-20 md:py-28">
        <div className="container">
          <SectionHead eyebrow={L("آراء العملاء", "Testimonials")} title={L("الناس بتقول إيه", "What people say")} />
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {TESTIMONIALS.map((tm, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
                <figure className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <Quote className="h-6 w-6 text-primary/40" aria-hidden />
                  <blockquote className="mt-3 leading-relaxed">{tr(tm.quote)}</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {tr(tm.name).charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{tr(tm.name)}</span>
                      <span className="flex gap-0.5 text-primary" aria-label={L("٥ نجوم", "5 stars")}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star key={s} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="scroll-mt-20 bg-card/50 py-20 md:py-28">
        <div className="container max-w-3xl">
          <SectionHead eyebrow={L("الأسئلة الشائعة", "FAQ")} title={L("أسئلة بتتكرر", "Common questions")} />
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <details className="group rounded-2xl border border-border/60 bg-card px-5 shadow-soft [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold">
                    {tr(f.q)}
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 leading-relaxed text-muted-foreground">{tr(f.a)}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-6 py-16 text-center text-white md:px-12 md:py-20">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,hsl(var(--primary)/0.45),transparent_70%)]"
                aria-hidden
              />
              <div className="relative">
                <Image
                  src={BRAND.images.avatar}
                  alt=""
                  width={72}
                  height={72}
                  className="mx-auto rounded-full ring-4 ring-white/10"
                />
                <h2 className="text-headline mt-6">
                  {tr(HERO.titleLine1)} <span className="text-primary">{tr(HERO.titleLine2)}</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{L("دلوقتي وقت تبدأ.", "Now is the time to start.")}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/register">
                      {L("اشترك الآن", "Subscribe now")}
                      <Arrow className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
                  >
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      {L("اسأل الكابتن على واتساب", "Ask the coach on WhatsApp")}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={L("تواصل على واتساب", "Chat on WhatsApp")}
        className="press fixed bottom-5 end-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </main>
  );
}

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="text-headline mt-3">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </Reveal>
  );
}

/** Horizontally scrolling, snap-aligned photo strip that bleeds to the screen edges. */
function PhotoRail({ images, alt, hint }: { images: string[]; alt: string; hint: string }) {
  return (
    <Reveal>
      <div
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scroll-padding-inline:1rem] md:px-[max(1rem,calc((100vw-1400px)/2+1rem))]"
        role="list"
        aria-label={alt}
        tabIndex={0}
      >
        {images.map((src, i) => (
          <div
            key={src}
            role="listitem"
            className="relative aspect-[3/4] w-[62vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-border/60 bg-muted sm:w-[240px]"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 640px) 280px, 62vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">{hint}</p>
    </Reveal>
  );
}

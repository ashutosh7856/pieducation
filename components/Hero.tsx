import { hero, stats } from "@/lib/content";
import { RouteMap } from "./RouteMap";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft sage glow anchored bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 h-[42rem] w-[42rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-sage), transparent 62%)" }}
      />

      <div className="container-x relative grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center pt-14 pb-20 lg:pt-20 lg:pb-28">
        {/* left: the thesis */}
        <div className="max-w-xl">
          <p className="eyebrow">{hero.eyebrow}</p>

          <h1 className="display-xl mt-6 text-ink">
            {hero.titleLead}
            <br />
            <span className="italic font-body font-medium text-terra">
              {hero.titleAccent}
            </span>
          </h1>

          <p className="lede mt-7 max-w-md">{hero.body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={hero.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 font-display text-base font-semibold text-paper hover:bg-forest-2 transition-colors"
            >
              {hero.primaryCta.label}
              <span aria-hidden>→</span>
            </a>
            <a
              href={hero.secondaryCta.href}
              className="font-display text-base font-semibold text-ink link-underline"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* right: the signature route map */}
        <div className="relative">
          <div className="rounded-3xl border border-line bg-paper-2/60 p-5 sm:p-8">
            <RouteMap className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* stats rail — hairline grid stays clean at any column count */}
      <div className="border-y border-line bg-line">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
          {stats.map((s) => (
            <div key={s.label} className="bg-paper px-2 py-7 text-center">
              <div className="font-display text-4xl md:text-5xl font-extrabold text-forest">
                {s.value}
              </div>
              <div className="mt-1.5 text-sm text-moss">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

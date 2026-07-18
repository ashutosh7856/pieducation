import { site } from "@/lib/content";

/** A quiet, confident band that bridges the stories and the FAQ/contact. */
export function CtaBand() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-paper-2/60 px-8 py-14 sm:px-14 sm:py-16 text-center">
          <p className="eyebrow justify-center">Your move</p>
          <h2 className="display-lg mt-5 mx-auto max-w-2xl text-ink">
            The best time to start was last year. The second best is today.
          </h2>
          <p className="lede mt-5 mx-auto max-w-xl">
            One free session is all it takes to know where you stand and what&rsquo;s
            possible. No cost, no commitment.
          </p>
          <a
            href="#contact"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 font-display text-base font-semibold text-paper hover:bg-forest-2 transition-colors"
          >
            Book a free session with {site.name}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

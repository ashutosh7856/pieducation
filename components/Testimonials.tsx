import { testimonials } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section id="stories" className="bg-sage py-24 lg:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Student stories</p>
          <h2 className="display-lg mt-5 text-ink">
            The proof is in where they landed.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal as="div" key={t.id} delay={i * 0.08}>
              <figure className="h-full flex flex-col rounded-2xl bg-paper p-7 border border-line">
                <span className="font-display text-5xl leading-none text-terra" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 font-body text-lg italic leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-line">
                  <div className="font-display font-bold text-ink">{t.name}</div>
                  <div className="text-sm text-moss">{t.detail}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

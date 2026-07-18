import { services } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="display-lg mt-5 text-ink">
            Three ways we get you further.
          </h2>
          <p className="lede mt-5">
            Most students come to us for one of these. Most leave having used all
            three — because the pieces only work when they work together.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <Reveal as="div" key={service.id} delay={i * 0.08}>
              <article className="group h-full flex flex-col rounded-2xl border border-line bg-paper-2/40 p-7 transition-colors hover:border-forest/40 hover:bg-paper-2">
                <span className="font-display text-sm font-semibold text-terra">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-md mt-4 text-ink">{service.title}</h3>
                <p className="mt-3 text-moss">{service.summary}</p>
                <ul className="mt-6 pt-6 border-t border-line flex flex-col gap-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-[0.95rem] text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-terra shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

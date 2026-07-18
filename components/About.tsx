import { site } from "@/lib/content";
import { Reveal } from "./Reveal";
import { RouteDivider } from "./RouteMap";

const proficiencies = [
  { label: "Admissions counselling", value: 96 },
  { label: "Test-prep coaching", value: 91 },
  { label: "Visa & scholarship success", value: 88 },
];

export function About() {
  const years = 2024 - site.established; // draft-safe static year

  return (
    <section id="about" className="py-24 lg:py-32">
      <RouteDivider />
      <div className="container-x mt-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="eyebrow">Why {site.name}</p>
          <h2 className="display-lg mt-5 text-ink">
            {years}+ years of telling students what they actually need to hear.
          </h2>
          <p className="mt-6 text-lg text-moss leading-relaxed">
            We started in {site.location} with a simple frustration: too many
            consultants sell the same three universities to everyone. We do the
            opposite — read your profile honestly, and build the plan around you.
          </p>
          <p className="mt-4 text-lg text-moss leading-relaxed">
            Senior counsellors, not junior agents, work your case from the first
            call to your first day on campus.
          </p>
        </div>

        <Reveal className="rounded-3xl border border-line bg-paper-2/40 p-8 sm:p-10">
          <div className="space-y-8">
            {proficiencies.map((p) => (
              <div key={p.label}>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-semibold text-ink">{p.label}</span>
                  <span className="font-display text-sm font-bold text-terra">{p.value}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full bg-forest"
                    style={{ width: `${p.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { nav, site } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-forest-2 text-paper">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7 text-paper" />
              <span className="font-display text-xl font-extrabold text-paper">
                {site.name}
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-cream-dim)" }}>
              {site.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-terra)" }}>
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-paper/80 hover:text-paper link-underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-terra)" }}>
              Reach us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
              <li>
                <a href={`tel:${site.whatsapp}`} className="link-underline">{site.phone}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
              </li>
              <li>{site.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-line-forest flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-cream-dim)" }}>
          <p>
            © {site.established}–present {site.name}. All rights reserved.
          </p>
          <p>Draft build · content is placeholder</p>
        </div>
      </div>
    </footer>
  );
}

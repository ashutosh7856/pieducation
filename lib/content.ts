/**
 * Editable site content — the admin-ready data layer.
 *
 * Every value here is intended to be editable from an admin panel backed by
 * Firestore. For the draft we serve these local defaults (no DB/billing needed).
 * When you're ready to go live, `getContent()` in lib/data.ts will merge any
 * document found at Firestore `content/site` over these defaults, so the shape
 * you see here is exactly the shape the admin will write.
 *
 * All placeholder copy below is safe to show a client and easy to swap.
 */

export type Service = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};

export type Step = {
  id: string;
  title: string;
  body: string;
};

export type Destination = {
  code: string; // ISO-ish label used by the route-map motif
  name: string;
  note: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string; // e.g. "SAT 1520 · admitted to Purdue"
};

export type Stat = {
  value: string;
  label: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export const site = {
  name: "Meridian",
  tagline: "Study-abroad & admissions counselling",
  description:
    "Meridian is an education consultancy guiding ambitious students to the right university abroad — with honest counselling, sharp test prep, and start-to-finish application support.",
  established: 2013,
  location: "Pune, Maharashtra",
  phone: "+91 90000 00000",
  whatsapp: "+919000000000",
  email: "hello@meridian.example",
  instagram: "https://instagram.com",
  address: "Level 4, FC Road, Shivajinagar, Pune 411005",
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Destinations", href: "#destinations" },
  { label: "Stories", href: "#stories" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Since 2013 · 900+ students placed",
  titleLead: "Empowering dreams,",
  titleAccent: "guiding futures.",
  body: "The university you belong at is rarely the one you first imagined. We help you find it — then get you in — with counselling that tells you the truth and prep that actually moves your score.",
  primaryCta: { label: "Book a free session", href: "#contact" },
  secondaryCta: { label: "See our approach", href: "#approach" },
};

export const stats: Stat[] = [
  { value: "900+", label: "Students placed" },
  { value: "42", label: "Partner universities" },
  { value: "11", label: "Countries" },
  { value: "10+", label: "Years guiding" },
];

export const services: Service[] = [
  {
    id: "counselling",
    title: "Admission counselling",
    summary:
      "One-on-one guidance to choose the right course, country, and shortlist — matched to your profile, not a brochure.",
    points: ["Profile evaluation", "Course & country fit", "University shortlist"],
  },
  {
    id: "test-prep",
    title: "Test preparation",
    summary:
      "Focused coaching for SAT, GRE, GMAT and IELTS with diagnostic tests, small batches, and weekly mocks.",
    points: ["SAT · GRE · GMAT", "IELTS & TOEFL", "Full-length mocks"],
  },
  {
    id: "applications",
    title: "Application support",
    summary:
      "Essays, SOPs, recommendations, and deadlines handled end-to-end — so nothing slips through the cracks.",
    points: ["SOP & essay editing", "Visa documentation", "Scholarship strategy"],
  },
];

export const steps: Step[] = [
  {
    id: "01",
    title: "Discovery call",
    body: "A free, honest conversation about your goals, budget, and timeline — no scripts, no pressure.",
  },
  {
    id: "02",
    title: "Profile & shortlist",
    body: "We map your strengths against real admit data and build a shortlist of reach, match, and safe universities.",
  },
  {
    id: "03",
    title: "Prep & applications",
    body: "Test coaching, essays, and paperwork run in parallel against every deadline, reviewed by a senior counsellor.",
  },
  {
    id: "04",
    title: "Offers & departure",
    body: "We compare offers and scholarships, handle visas, and prep you for the move — right up to boarding.",
  },
];

export const destinations: Destination[] = [
  { code: "US", name: "United States", note: "STEM & research" },
  { code: "UK", name: "United Kingdom", note: "1-year masters" },
  { code: "CA", name: "Canada", note: "Work & PR pathway" },
  { code: "AU", name: "Australia", note: "Post-study work" },
  { code: "DE", name: "Germany", note: "Low-cost, English-taught" },
  { code: "IE", name: "Ireland", note: "Tech & pharma hub" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I came in fixated on one country. Meridian pushed back with data, and I ended up somewhere better than my dream school — with a scholarship I didn't know I qualified for.",
    name: "Ananya R.",
    detail: "MS Computer Science · admitted to Purdue",
  },
  {
    id: "t2",
    quote:
      "The test prep was ruthless in the best way. Weekly mocks, real feedback, no fluff. My GRE went up 14 points in six weeks.",
    name: "Karan M.",
    detail: "GRE 329 · admitted to TU Munich",
  },
  {
    id: "t3",
    quote:
      "They treated my SOP like it mattered. Three rewrites later it actually sounded like me — and three universities said yes.",
    name: "Fatima S.",
    detail: "MSc Finance · admitted to Trinity College Dublin",
  },
];

export const faqs: FaqItem[] = [
  {
    q: "Is the first counselling session really free?",
    a: "Yes. The discovery call is free and has no obligation. We'd rather earn your trust than sell you a package on day one.",
  },
  {
    q: "When should I start the process?",
    a: "Ideally 12–15 months before your intake, so test prep and applications aren't rushed. That said, we regularly help students on tighter timelines.",
  },
  {
    q: "Do you help with scholarships and visas?",
    a: "Both. Scholarship strategy is built into the application phase, and we handle visa documentation and interview prep before departure.",
  },
];

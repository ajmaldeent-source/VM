// Structured local content for the POC. In Phase 3 this moves to the headless CMS
// (Sanity/Strapi). All copy below is placeholder text pending client approval.

export const company = {
  name: "Saja General Trading & Contracting Est.",
  shortName: "Saja",
  founded: 1979,
  tagline: "Engineering Excellence Since 1979",
  intro:
    "Supplying and supporting Kuwait's Oil, Gas, Power, Water and Petrochemical sectors with mechanical, instrumentation and engineering services.",
  // TODO(client): confirm official address, phone and email before staging sign-off.
  contact: {
    address: "Kuwait — address to be confirmed",
    phone: "+965 0000 0000",
    email: "info@example.com",
    hours: "Sun–Thu, 7:30–16:30",
  },
};

export const stats = [
  { value: 47, suffix: "+", label: "Years in operation" },
  { value: 5, suffix: "", label: "Industry sectors served" },
  { value: 3, suffix: "", label: "Core service lines" },
  { value: 100, suffix: "%", label: "Placeholder metric — confirm" },
];

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: "gear" | "gauge" | "blueprint" | "factory";
  description: string;
  capabilities: string[];
  specs: { label: string; value: string }[];
};

export const services: Service[] = [
  {
    slug: "mechanical",
    title: "Mechanical",
    summary: "Valves, piping components, rotating equipment spares and fabrication support.",
    icon: "gear",
    description:
      "Supply of mechanical equipment and components for upstream and downstream facilities, sourced from approved manufacturers and supported locally.",
    capabilities: [
      "Valves, actuators and piping components",
      "Rotating equipment spares",
      "Flanges, fittings and fasteners",
      "Fabrication and site support",
    ],
    specs: [
      { label: "Standards", value: "API / ASME / ISO — confirm per product line" },
      { label: "Documentation", value: "MTCs, datasheets, inspection reports" },
      { label: "Lead times", value: "Stock and project-based supply" },
    ],
  },
  {
    slug: "instrumentation",
    title: "Instrumentation",
    summary: "Field instruments, control components and calibration support.",
    icon: "gauge",
    description:
      "Instrumentation supply and service for measurement, control and safety systems across process plants.",
    capabilities: [
      "Pressure, flow, level and temperature instruments",
      "Control valves and positioners",
      "Tubing, fittings and manifolds",
      "Calibration and commissioning support",
    ],
    specs: [
      { label: "Certifications", value: "ATEX / IECEx where applicable — confirm" },
      { label: "Calibration", value: "Traceable calibration certificates" },
      { label: "Support", value: "Installation and commissioning assistance" },
    ],
  },
  {
    slug: "engineering-services",
    title: "Engineering Services",
    summary: "Technical consultation, project execution and maintenance support.",
    icon: "blueprint",
    description:
      "Engineering and contracting services that take projects from specification through delivery and handover.",
    capabilities: [
      "Technical review and specification support",
      "Project management and execution",
      "Shutdown and maintenance support",
      "Quality assurance and audits",
    ],
    specs: [
      { label: "Approach", value: "Specification → procurement → delivery → handover" },
      { label: "QA/QC", value: "Inspection and test plans per project" },
      { label: "HSE", value: "Client HSE requirements — confirm policy documents" },
    ],
  },
  {
    slug: "workshop",
    title: "Workshop Facilities",
    summary: "In-house workshop for testing, assembly and repair.",
    icon: "factory",
    description:
      "A local workshop supporting assembly, testing, repair and refurbishment to reduce turnaround for clients.",
    capabilities: [
      "Valve testing and repair",
      "Assembly and modification",
      "Pressure testing",
      "Refurbishment and painting",
    ],
    specs: [
      { label: "Location", value: "Kuwait — confirm" },
      { label: "Test capability", value: "To be confirmed with workshop team" },
      { label: "Turnaround", value: "Project dependent" },
    ],
  },
];

export const sectors = ["Oil", "Gas", "Power", "Water", "Petrochemical"];

// TODO(client): replace with authorized client logos. Names are shown as text
// until usage rights are confirmed.
export const clients = ["KOC", "KNPC", "Client 03", "Client 04", "Client 05", "Client 06", "Client 07", "Client 08"];

export type Insight = {
  slug: string;
  title: string;
  category: "Audits" | "Facility" | "Projects" | "Company";
  date: string;
  excerpt: string;
};

export const insights: Insight[] = [
  {
    slug: "workshop-expansion",
    title: "Expanding our workshop capability",
    category: "Facility",
    date: "2026-09-01",
    excerpt: "Placeholder article: new test bench and assembly area to shorten turnaround times.",
  },
  {
    slug: "quality-audit",
    title: "Successful supplier quality audit",
    category: "Audits",
    date: "2026-07-14",
    excerpt: "Placeholder article: outcome of a recent client supplier audit and what it covered.",
  },
  {
    slug: "instrumentation-delivery",
    title: "Instrumentation package delivered on schedule",
    category: "Projects",
    date: "2026-05-20",
    excerpt: "Placeholder case study: scope, timeline and lessons from a recent delivery.",
  },
  {
    slug: "47-years",
    title: "47 years of service in Kuwait",
    category: "Company",
    date: "2026-01-10",
    excerpt: "Placeholder article: a look back at the company's history since 1979.",
  },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

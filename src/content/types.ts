// Shape shared by every language dictionary. Adding a key here forces each
// translation to provide it, so the English and Arabic sites can't drift apart.

export type ServiceIcon = "gear" | "gauge" | "blueprint" | "factory";

export type Service = {
  slug: string;
  icon: ServiceIcon;
  title: string;
  summary: string;
  description: string;
  capabilities: string[];
  specs: { label: string; value: string }[];
};

export type ProductCategory = "valves" | "instruments" | "fittings" | "spares";

export type Product = {
  slug: string;
  category: ProductCategory;
  name: string;
  summary: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  imageUrl: string;
};

export type InsightCategory = "audits" | "facility" | "projects" | "company";

export type Insight = {
  slug: string;
  category: InsightCategory;
  date: string;
  title: string;
  excerpt: string;
};

export type EnquiryErrorCode =
  | "type_required"
  | "name_required"
  | "email_invalid"
  | "phone_invalid"
  | "message_short";

export type Dictionary = {
  company: {
    name: string;
    shortName: string;
    tagline: string;
    intro: string;
    contact: { address: string; phone: string; email: string; hours: string };
  };
  nav: { home: string; about: string; services: string; products: string; insights: string; contact: string };
  sectors: string[];
  stats: { value: number; suffix: string; label: string }[];
  services: Service[];
  insights: Insight[];
  productCategories: Record<ProductCategory | "all", string>;
  insightCategories: Record<InsightCategory | "all", string>;
  ui: {
    skipToContent: string;
    requestQuote: string;
    openMenu: string;
    closeMenu: string;
    toLight: string;
    toDark: string;
    switchLanguage: string;
    home: string;
    hero: {
      location: string;
      titleA: string;
      titleHighlight: string;
      titleB: string;
      explore: string;
      pause: string;
      play: string;
      prev: string;
      next: string;
      slide: (n: number, total: number) => string;
      placeholderBadge: string;
    };
    home_: {
      scopeEyebrow: string;
      scopeTitle: string;
      scopeIntro: string;
      clientsEyebrow: string;
      clientsTitle: string;
      insightsEyebrow: string;
      insightsTitle: string;
      allInsights: string;
      productsEyebrow: string;
      productsTitle: string;
      allProducts: string;
    };
    viewCapabilities: string;
    cta: { title: string; body: string; button: string };
    about: {
      eyebrow: string;
      title: (years: number) => string;
      intro: string;
      values: { title: string; body: string }[];
      journeyEyebrow: string;
      journeyTitle: string;
      timeline: { year: string; text: string }[];
    };
    servicesPage: { eyebrow: string; title: string; intro: string };
    servicePage: {
      eyebrow: string;
      capabilities: string;
      specs: string;
      brochure: string;
      brochureBody: string;
      brochureButton: string;
      others: string;
    };
    productsPage: { eyebrow: string; title: string; intro: string; filterLabel: string; viewProduct: string };
    productPage: {
      eyebrow: string;
      features: string;
      specs: string;
      requestQuote: string;
      quoteNote: string;
      related: string;
      back: string;
      placeholderNote: string;
    };
    insightsPage: { eyebrow: string; title: string; intro: string; filterLabel: string };
    contactPage: {
      eyebrow: string;
      title: string;
      intro: string;
      officeTitle: string;
      labels: { address: string; phone: string; email: string; hours: string };
      mapLabel: string;
      mapCaption: string;
    };
    form: {
      progress: string;
      steps: [string, string, string];
      typeQuestion: string;
      types: Record<string, string>;
      service: string;
      serviceAny: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      message: string;
      messagePlaceholder: string;
      productPrefix: string;
      back: string;
      continue: string;
      send: string;
      sending: string;
      thanks: (name: string) => string;
      thanksBody: string;
      another: string;
      genericError: string;
      checkFields: string;
      errors: Record<EnquiryErrorCode, string>;
    };
    footer: { company: string; services: string; contact: string; note: string };
    notFound: { title: string; back: string };
    account: {
      menu: string;
      loginTitle: string;
      loginBody: string;
      continueGoogle: string;
      redirecting: string;
      notConfigured: string;
      title: string;
      welcome: (name: string) => string;
      profile: string;
      name: string;
      email: string;
      enquiries: string;
      enquiriesEmpty: string;
      enquiriesUnavailable: string;
      colDate: string;
      colType: string;
      colStatus: string;
      statuses: { new: string; in_progress: string; closed: string };
      newEnquiry: string;
      signOut: string;
      staffNote: string;
      staffLink: string;
    };
  };
};

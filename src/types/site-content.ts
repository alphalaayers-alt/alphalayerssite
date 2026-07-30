export interface SiteFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SiteServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
  image: string;
}

export interface SiteProductItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  metrics: string;
  features: string[];
  image: string;
}

export interface SiteProjectItem {
  id: string;
  title: string;
  client: string;
  category: string;
  impact: string;
  description: string;
  image: string;
  year: string;
}

export interface SiteTestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface SiteTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string;
}

export interface SiteHomeServiceCard {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: string;
}

export interface SiteContent {
  updatedAt: string;
  brand: {
    name: string;
    tagline: string;
    logoNav: string;
    logoFooter: string;
    favicon: string;
    seoTitle: string;
    seoDescription: string;
  };
  nav: {
    ctaLabel: string;
    contactLabel: string;
    items: { id: string; label: string; visible: boolean }[];
  };
  footer: {
    blurb: string;
    address: string;
    phone: string;
    email: string;
    newsletterHeading: string;
    newsletterBlurb: string;
    copyrightName: string;
  };
  home: {
    hero: {
      welcomeTag: string;
      headline: string;
      headlineAccent: string;
      description: string;
      primaryCta: string;
      teamLabel: string;
      floatingBadge: string;
      experienceNumber: string;
      experienceLabel: string;
      image: string;
      teamAvatars: string[];
    };
    aboutTeaser: {
      badge: string;
      headline: string;
      visionTitle: string;
      visionText: string;
      missionTitle: string;
      missionText: string;
      ctaText: string;
      ctaLabel: string;
      image: string;
    };
    servicesTeaser: {
      badge: string;
      headline: string;
      blurb: string;
      ctaLabel: string;
      cards: SiteHomeServiceCard[];
    };
    productsSection: { badge: string; headline: string; description: string; viewAllLabel: string };
    projectsSection: { badge: string; headline: string; description: string; viewAllLabel: string };
    testimonialsSection: { badge: string; headline: string; description: string };
    blogSection: { badge: string; headline: string; description: string; viewAllLabel: string };
    stats: { id: string; number: string; symbol: string; label: string }[];
  };
  pages: {
    about: {
      badge: string;
      headline: string;
      description: string;
      missionTitle: string;
      missionBody: string;
      visionTitle: string;
      visionBody: string;
      teamEyebrow: string;
      teamHeadline: string;
      teamSubtext: string;
      ctaHeadline: string;
      ctaSubtext: string;
      ctaButtonLabel: string;
    };
    services: { badge: string; headline: string; description: string; inquireLabel: string };
    products: { badge: string; headline: string; description: string; demoCtaLabel: string };
    projects: { badge: string; headline: string; description: string; caseStudyCtaLabel: string };
    blog: { badge: string; headline: string; description: string; searchPlaceholder: string };
    contact: {
      badge: string;
      headline: string;
      description: string;
      hqTitle: string;
      hqBlurb: string;
      address: string;
      phone: string;
      email: string;
      hours: string;
      submitLabel: string;
      successTitle: string;
      successBody: string;
    };
    faq: {
      badge: string;
      title: string;
      subtitle: string;
      ctaEyebrow: string;
      ctaHeadline: string;
      ctaSubtext: string;
      ctaButtonLabel: string;
    };
  };
  collections: {
    services: SiteServiceItem[];
    products: SiteProductItem[];
    projects: SiteProjectItem[];
    testimonials: SiteTestimonialItem[];
    team: SiteTeamMember[];
    faqs: SiteFaqItem[];
  };
  modals: {
    quote: {
      badge: string;
      title: string;
      subtitle: string;
      serviceOptions: string[];
      submitLabel: string;
      successTitle: string;
      successBody: string;
    };
    video: {
      title: string;
      headline: string;
      description: string;
      thumbImage: string;
      videoUrl: string;
    };
  };
}

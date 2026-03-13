export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioProject = {
  slug: string;
  name: string;
  i18nKey?: string;
  summary: string;
  description?: string;
  role?: string;
  highlights?: string[];
  tech: string[];
  links?: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
};

export type PortfolioExperience = {
  i18nKey?: string;
  company: string;
  title: string;
  location?: string;
  start: string;
  end: string;
  summary?: string;
  bullets: string[];
  tech?: string[];
  links?: PortfolioLink[];
};

export type PortfolioTestimonial = {
  i18nKey?: string;
  name: string;
  title?: string;
  company?: string;
  quote: string;
};

export type PortfolioHighlight = {
  i18nKey?: string;
  label: string;
  value: string;
  hint?: string;
};

export type PortfolioEducation = {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

export type PortfolioLanguage = {
  name: string;
  level: string;
};

export type PortfolioCertification = {
  name: string;
  issuer: string;
  date: string;
};

export type Portfolio = {
  person: {
    fullName: string;
    role: string;
    location: string;
    availabilityLabelKey?: string;
    availabilityLabel?: string;
    shortBioKey?: string;
    shortBio: string;
    aboutKey?: string;
    about: string[];
  };
  links: {
    email: string;
    website?: string;
    github?: string;
    linkedin?: string;
    x?: string;
    devto?: string;
    medium?: string;
    stackoverflow?: string;
    scheduleCall?: string;
    resumePdf?: string;
  };
  highlights: PortfolioHighlight[];
  skills: {
    primary: string[];
    secondary?: string[];
    tooling?: string[];
  };
  experience: PortfolioExperience[];
  projects: PortfolioProject[];
  testimonials?: PortfolioTestimonial[];
  education?: PortfolioEducation[];
  certifications?: PortfolioCertification[];
  languages?: PortfolioLanguage[];
};

/**
 * Portfolio data lives in the locale JSON files:
 * - content/locale/en.json -> portfolioData
 * - content/locale/es.json -> portfolioData
 *
 * This file keeps only the TypeScript types.
 * Add a new experience, project, education or certification
 * in the JSON files and the portfolio + resume PDF updates automatically.
 */

export type LanguageCode = 'en' | 'es';

export type I18nString = {
  en: string;
  es: string;
};

export type I18nStringArray = {
  en: string[];
  es: string[];
};

/** Technology tag for projects and skills */
export type TechTag = string;

/** Origin of the project */
export type ProjectTag = 'professional' | 'personal';

/** Nature/category of the project */
export type ProjectCategory = 'full-stack' | 'backend' | 'infrastructure' | 'data-science' | 'use-case';

/** A project developed within a job or independently */
export interface Project {
  id: string;
  name: I18nString;
  description: I18nString;
  shortDescription?: I18nString;
  technologies: TechTag[];
  tag?: ProjectTag;
  category?: ProjectCategory;
  company?: string;
  link?: string;
  github?: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
  media?: Array<{
    type: 'image' | 'youtube' | 'link';
    src: string;
    title?: I18nString;
    alt?: I18nString;
  }>;
  roleHighlight?: I18nString;
  repositoryNotice?: I18nString;
  caseStudy?: {
    title?: I18nString;
    challenge: I18nString;
    solution: I18nString;
    contribution: I18nString;
    evolution?: I18nString;
  };
  featured?: boolean;
}

/** A single work experience entry with nested projects */
export interface JobExperience {
  id: string;
  company: string;
  companyUrl?: string;
  jobUrl?: string;
  role: I18nString;
  summary?: I18nString;
  startDate: { month: I18nString; year: number };
  endDate?: { month: I18nString; year: number };
  current?: boolean;
  location?: I18nString;
  locationType?: 'on-site' | 'hybrid' | 'remote';
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  highlights: I18nStringArray;
  projectIds: string[];
  photos?: Array<{
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
    thumbnail?: { src: string; srcSet?: string };
    kind: 'photo' | 'logo';
    alt: I18nString;
    caption?: I18nString;
    brandText?: string;
    brandSubtext?: string;
  }>;
}

/** Embedded media attachment (PDF, image, etc.) */
export interface EducationMedia {
  type: 'pdf' | 'image';
  src: string;
  alt?: string;
  /** Set to true if the PDF content is rotated and needs CSS correction */
  rotated?: boolean;
  /** Custom PDF view mode parameter (e.g. 'Fit', 'FitH', 'FitV'). Defaults to 'FitH'. */
  viewMode?: 'Fit' | 'FitH' | 'FitV' | string;
}

/** Education entry (degree/carrera) — data-driven for N items */
export interface Education {
  id: string;
  institution: string;
  institutionUrl?: string;
  degree: I18nString;
  field: I18nString;
  discipline?: I18nString;
  startDate: { month: I18nString; year: number };
  endDate?: { month: I18nString; year: number };
  grade?: string;
  description?: I18nString;
  activities?: I18nString;
  achievements?: I18nStringArray;
  skills?: string[];
  media?: EducationMedia[];
}

/** Certificate / Certification — data-driven for N items */
export interface Certificate {
  id: string;
  name: I18nString;
  issuer: string;
  issuerUrl?: string;
  issueDate?: { month: I18nString; year: number };
  expirationDate?: { month: I18nString; year: number };
  credentialId?: string;
  credentialUrl?: string;
  description?: I18nString;
  skills?: string[];
  media?: EducationMedia[];
}

/** Language proficiency */
export interface Language {
  name: I18nString;
  level: I18nString;
  flag?: string;
}

/** Skill category for the tech stack grid */
export interface SkillCategory {
  name: I18nString;
  skills: string[];
}

/** Social link */
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

/** Navigation link */
export interface NavLink {
  name: I18nString;
  url: string;
}

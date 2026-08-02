// FILE: src/types/resume.ts

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  /** base64 data URL of the uploaded profile photo, or null if none */
  photo: string | null;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  /** comma-separated, kept as free text rather than another sub-list to stay simple to edit */
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  /** free text, e.g. "Native", "Fluent", "Conversational", "Basic" */
  proficiency: string;
}

export type LinkPlatform =
  | 'linkedin'
  | 'github'
  | 'website'
  | 'behance'
  | 'dribbble'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'youtube'
  | 'medium'
  | 'quora'
  | 'tiktok'
  | 'other';

export interface SocialLink {
  id: string;
  platform: LinkPlatform;
  url: string;
  /** shown instead of the platform name when platform === 'other' */
  customLabel: string;
}

export const LINK_PLATFORMS: { id: LinkPlatform; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'github', label: 'GitHub' },
  { id: 'website', label: 'Portfolio / Website' },
  { id: 'behance', label: 'Behance' },
  { id: 'dribbble', label: 'Dribbble' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'medium', label: 'Medium' },
  { id: 'quora', label: 'Quora' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'other', label: 'Other' },
];

/** The short label shown on the resume in place of the raw URL, e.g. "LinkedIn". */
export function linkLabel(link: SocialLink): string {
  if (link.platform === 'other') return link.customLabel.trim() || 'Link';
  return LINK_PLATFORMS.find((p) => p.id === link.platform)?.label ?? 'Link';
}

/** Ensures a URL has a scheme so it's an actual clickable/navigable link, not just text. */
export function normalizeLinkUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('mailto:')) return trimmed;
  return `https://${trimmed}`;
}

function generateLinkId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `link_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Per-resume formatting preferences for bullet points and bold text.
 * "experience"/"projects" control whether description text is parsed for
 * `**bold**` markup and split into bullet points (one per line). "skills"/
 * "languages" control whether those sections render as a vertical bulleted
 * list instead of a horizontal tag cloud. Certifications, Education, and
 * the base layout of Experience/Projects are already vertically stacked
 * one-per-line in every template, so they don't need a toggle here.
 */
export interface FormattingOptions {
  enabled: boolean;
  sections: {
    experience: boolean;
    projects: boolean;
    skills: boolean;
    languages: boolean;
  };
}

export const defaultFormattingOptions: FormattingOptions = {
  enabled: false,
  sections: { experience: true, projects: true, skills: true, languages: true },
};

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'technical'
  | 'editorial'
  | 'compact'
  | 'bold'
  | 'academic';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  supportsPhoto: boolean;
  /** true if the layout is single-column/text-linear and safe for applicant tracking systems
   *  to parse; false for multi-column layouts that can scramble ATS text extraction */
  atsFriendly: boolean;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Solid header band, single column. Safe for any industry.',
    supportsPhoto: true,
    atsFriendly: true,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark sidebar with contact & skills, main column for experience.',
    supportsPhoto: true,
    atsFriendly: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'No color, just type and rules. Great for ATS scanning.',
    supportsPhoto: false,
    atsFriendly: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold accent color, circular photo, playful skill tags.',
    supportsPhoto: true,
    atsFriendly: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Navy & brass serif design with a centered header. For senior/leadership roles.',
    supportsPhoto: true,
    atsFriendly: true,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-editor look with monospace type and syntax-style coloring. For developers.',
    supportsPhoto: true,
    atsFriendly: true,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine masthead header, serif + sans pairing, two-column body.',
    supportsPhoto: true,
    atsFriendly: false,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense two-column layout, no icons or color. Maximizes info per page.',
    supportsPhoto: false,
    atsFriendly: false,
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Geometric violet color-block header with amber accents. Makes a statement.',
    supportsPhoto: true,
    atsFriendly: true,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal serif CV layout with justified text. For research & academic roles.',
    supportsPhoto: false,
    atsFriendly: true,
  },
];

/** The full data for one resume, as edited in the builder. */
export interface ResumeContent {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageItem[];
  links: SocialLink[];
  templateId: TemplateId;
  formatting: FormattingOptions;
}

/** A resume as stored in IndexedDB (content + record metadata). */
export interface SavedResume extends ResumeContent {
  id: string;
  /** user-facing title for this saved resume, e.g. "Frontend Dev - Google" */
  title: string;
  createdAt: number;
  updatedAt: number;
  /** small cached JPEG snapshot (base64 data URL) of the rendered resume, used in History cards */
  thumbnail?: string;
}

export const emptyPersonalInfo: PersonalInfo = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  photo: null,
};

export function createBlankResume(): ResumeContent {
  return {
    personalInfo: { ...emptyPersonalInfo },
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    links: [],
    templateId: 'classic',
    formatting: { ...defaultFormattingOptions, sections: { ...defaultFormattingOptions.sections } },
  };
}

/** Fills in any fields missing from a resume saved before this data model existed,
 *  so older IndexedDB records don't crash templates expecting arrays to exist.
 *  Also migrates the old fixed website/linkedin/github text fields (if present on
 *  a legacy record) into the new flexible `links` list, once, the first time an
 *  old resume is loaded. */
export function normalizeResumeContent<T extends Partial<ResumeContent>>(content: T): T & ResumeContent {
  const legacyPersonalInfo = content.personalInfo as (PersonalInfo & { website?: string; linkedin?: string; github?: string }) | undefined;

  let links = content.links ?? [];
  if (links.length === 0 && legacyPersonalInfo) {
    const migrated: SocialLink[] = [];
    if (legacyPersonalInfo.linkedin) {
      migrated.push({ id: generateLinkId(), platform: 'linkedin', url: legacyPersonalInfo.linkedin, customLabel: '' });
    }
    if (legacyPersonalInfo.github) {
      migrated.push({ id: generateLinkId(), platform: 'github', url: legacyPersonalInfo.github, customLabel: '' });
    }
    if (legacyPersonalInfo.website) {
      migrated.push({ id: generateLinkId(), platform: 'website', url: legacyPersonalInfo.website, customLabel: '' });
    }
    links = migrated;
  }

  return {
    ...content,
    experiences: content.experiences ?? [],
    educations: content.educations ?? [],
    skills: content.skills ?? [],
    projects: content.projects ?? [],
    certifications: content.certifications ?? [],
    languages: content.languages ?? [],
    links,
    personalInfo: content.personalInfo ?? { ...emptyPersonalInfo },
    templateId: content.templateId ?? 'classic',
    formatting: content.formatting
      ? { ...defaultFormattingOptions, ...content.formatting, sections: { ...defaultFormattingOptions.sections, ...content.formatting.sections } }
      : { ...defaultFormattingOptions, sections: { ...defaultFormattingOptions.sections } },
  } as T & ResumeContent;
}

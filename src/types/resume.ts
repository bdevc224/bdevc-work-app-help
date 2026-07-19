// FILE: src/types/resume.ts

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
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
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Solid header band, single column. Safe for any industry.',
    supportsPhoto: true,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark sidebar with contact & skills, main column for experience.',
    supportsPhoto: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'No color, just type and rules. Great for ATS scanning.',
    supportsPhoto: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold accent color, circular photo, playful skill tags.',
    supportsPhoto: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Navy & brass serif design with a centered header. For senior/leadership roles.',
    supportsPhoto: true,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-editor look with monospace type and syntax-style coloring. For developers.',
    supportsPhoto: true,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine masthead header, serif + sans pairing, two-column body.',
    supportsPhoto: true,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Dense two-column layout, no icons or color. Maximizes info per page.',
    supportsPhoto: false,
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Geometric violet color-block header with amber accents. Makes a statement.',
    supportsPhoto: true,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal serif CV layout with justified text. For research & academic roles.',
    supportsPhoto: false,
  },
];

/** The full data for one resume, as edited in the builder. */
export interface ResumeContent {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  templateId: TemplateId;
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
  website: '',
  linkedin: '',
  github: '',
  summary: '',
  photo: null,
};

export function createBlankResume(): ResumeContent {
  return {
    personalInfo: { ...emptyPersonalInfo },
    experiences: [],
    educations: [],
    skills: [],
    templateId: 'classic',
  };
}

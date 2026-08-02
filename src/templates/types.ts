// FILE: src/templates/types.ts

import type { PersonalInfo, Experience, Education, Skill, Project, Certification, LanguageItem, SocialLink, FormattingOptions } from '../types/resume';

export interface TemplateProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: LanguageItem[];
  links?: SocialLink[];
  formatting?: FormattingOptions;
}

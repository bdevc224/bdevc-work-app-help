// FILE: src/templates/types.ts

import type { PersonalInfo, Experience, Education, Skill } from '../types/resume';

export interface TemplateProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

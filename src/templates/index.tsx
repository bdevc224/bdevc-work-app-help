// FILE: src/templates/index.tsx

import React, { forwardRef } from 'react';
import type { TemplateId } from '../types/resume';
import type { TemplateProps } from './types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechnicalTemplate from './TechnicalTemplate';
import EditorialTemplate from './EditorialTemplate';
import CompactTemplate from './CompactTemplate';
import BoldTemplate from './BoldTemplate';
import AcademicTemplate from './AcademicTemplate';

const TEMPLATE_COMPONENTS: Record<TemplateId, React.FC<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
  editorial: EditorialTemplate,
  compact: CompactTemplate,
  bold: BoldTemplate,
  academic: AcademicTemplate,
};

interface ResumeRendererProps extends TemplateProps {
  templateId: TemplateId;
}

/** Renders the chosen template inside a ref'd wrapper, used for both on-screen preview and PDF capture. */
const ResumeRenderer = forwardRef<HTMLDivElement, ResumeRendererProps>(({ templateId, ...props }, ref) => {
  const Component = TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
  return (
    <div ref={ref}>
      <Component {...props} />
    </div>
  );
});

ResumeRenderer.displayName = 'ResumeRenderer';

export default ResumeRenderer;

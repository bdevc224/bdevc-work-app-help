// FILE: src/templates/AcademicTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const MAROON = '#7f1d1d';
const SERIF = "'Times New Roman', Georgia, serif";

const AcademicTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ fontFamily: SERIF, padding: '40px 50px', color: '#1f2937' }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${MAROON}`, paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>{personalInfo.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>{personalInfo.jobTitle || 'Job Title'}</p>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  ·  ')}
        </p>
        {(personalInfo.website || personalInfo.linkedin) && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {[personalInfo.website, personalInfo.linkedin].filter(Boolean).join('  ·  ')}
          </p>
        )}
      </div>

      {personalInfo.summary && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '13px', lineHeight: '1.7', textAlign: 'justify' }}>{personalInfo.summary}</p>
        </div>
      )}

      {educations.filter((e) => e.institution || e.degree).length > 0 && (
        <div style={{ marginTop: '22px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: MAROON, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px' }}>
            Education
          </h2>
          {educations.map(
            (edu) =>
              (edu.institution || edu.degree) && (
                <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span style={{ color: '#4b5563' }}> — {edu.institution}</span>
                    {edu.gpa && <span style={{ color: '#6b7280' }}> (GPA: {edu.gpa})</span>}
                  </div>
                  {(edu.startDate || edu.endDate) && <span style={{ fontSize: '12.5px', color: '#6b7280' }}>{edu.startDate} – {edu.endDate}</span>}
                </div>
              )
          )}
        </div>
      )}

      {experiences.filter((e) => e.company || e.position).length > 0 && (
        <div style={{ marginTop: '22px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: MAROON, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px' }}>
            Appointments & Experience
          </h2>
          {experiences.map(
            (exp) =>
              (exp.company || exp.position) && (
                <div key={exp.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{exp.position || 'Position'}, {exp.company || 'Institution'}</span>
                    {(exp.startDate || exp.endDate) && <span style={{ fontSize: '12.5px', color: '#6b7280' }}>{exp.startDate} – {exp.endDate}</span>}
                  </div>
                  {exp.description && <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', marginTop: '4px', textAlign: 'justify' }}>{exp.description}</p>}
                </div>
              )
          )}
        </div>
      )}

      {skills.filter((s) => s.name).length > 0 && (
        <div style={{ marginTop: '22px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: MAROON, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px' }}>
            Competencies
          </h2>
          <p style={{ fontSize: '13px', lineHeight: '1.7' }}>{skills.filter((s) => s.name).map((s) => s.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default AcademicTemplate;

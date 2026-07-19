// FILE: src/templates/MinimalTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const MinimalTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ padding: '40px 44px', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '0.02em' }}>
          {(personalInfo.fullName || 'Your Name').toUpperCase()}
        </h1>
        <p style={{ fontSize: '15px', color: '#374151', marginTop: '4px' }}>{personalInfo.jobTitle || 'Job Title'}</p>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('   •   ')}
        </p>
        {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {[personalInfo.website, personalInfo.linkedin, personalInfo.github].filter(Boolean).join('   •   ')}
          </p>
        )}
        <div style={{ borderTop: '1px solid #d1d5db', marginTop: '16px' }} />
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', fontStyle: 'italic' }}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.filter((exp) => exp.company || exp.position).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            EXPERIENCE
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>
                        {exp.position || 'Position'}, <span style={{ fontWeight: 400 }}>{exp.company || 'Company'}</span>
                      </h3>
                      {(exp.startDate || exp.endDate) && (
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>{exp.startDate} – {exp.endDate}</span>
                      )}
                    </div>
                    {exp.description && <p style={{ color: '#374151', fontSize: '13px', marginTop: '4px', lineHeight: '1.5' }}>{exp.description}</p>}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {educations.filter((edu) => edu.institution || edu.degree).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            EDUCATION
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}, <span style={{ fontWeight: 400 }}>{edu.institution}</span>
                      </h3>
                      {(edu.startDate || edu.endDate) && (
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>{edu.startDate} – {edu.endDate}</span>
                      )}
                    </div>
                    {edu.gpa && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>GPA: {edu.gpa}</p>}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {skills.filter((s) => s.name).length > 0 && (
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            SKILLS
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            <p style={{ fontSize: '13px', color: '#374151' }}>
              {skills.filter((s) => s.name).map((s) => s.name).join('  •  ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;

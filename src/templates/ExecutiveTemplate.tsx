// FILE: src/templates/ExecutiveTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const NAVY = '#0b1f3a';
const BRASS = '#9c7a3c';
const SERIF = "Georgia, 'Times New Roman', serif";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
    <div style={{ width: '18px', height: '2px', backgroundColor: BRASS }} />
    <h2 style={{ fontFamily: SERIF, fontSize: '13px', fontWeight: 700, color: NAVY, letterSpacing: '0.16em', textTransform: 'uppercase', margin: 0 }}>
      {children}
    </h2>
  </div>
);

const ExecutiveTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ fontFamily: SERIF, padding: '44px 48px' }}>
      <div style={{ textAlign: 'center' }}>
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt=""
            style={{ width: '76px', height: '76px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 14px', display: 'block', border: `1px solid ${BRASS}` }}
          />
        )}
        <h1 style={{ fontSize: '32px', fontWeight: 400, color: NAVY, letterSpacing: '0.06em', margin: 0 }}>
          {(personalInfo.fullName || 'Your Name').toUpperCase()}
        </h1>
        <p style={{ fontSize: '13px', color: BRASS, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px' }}>
          {personalInfo.jobTitle || 'Job Title'}
        </p>
        <div style={{ width: '60px', height: '1px', backgroundColor: BRASS, margin: '16px auto' }} />
        <p style={{ fontSize: '12px', color: '#4b5563', letterSpacing: '0.02em' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('   |   ')}
        </p>
        {(personalInfo.linkedin || personalInfo.website || personalInfo.github) && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {[personalInfo.website, personalInfo.linkedin, personalInfo.github].filter(Boolean).join('   |   ')}
          </p>
        )}
      </div>

      {personalInfo.summary && (
        <div style={{ marginTop: '32px' }}>
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', textAlign: 'center', fontStyle: 'italic' }}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.filter((e) => e.company || e.position).length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <SectionHeading>Professional Experience</SectionHeading>
          {experiences.map(
            (exp) =>
              (exp.company || exp.position) && (
                <div key={exp.id} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{exp.position || 'Position'}</h3>
                    {(exp.startDate || exp.endDate) && (
                      <span style={{ fontSize: '12px', color: BRASS, fontStyle: 'italic' }}>{exp.startDate} — {exp.endDate}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: NAVY, fontWeight: 600, margin: '2px 0 6px' }}>{exp.company || 'Company'}</p>
                  {exp.description && <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{exp.description}</p>}
                </div>
              )
          )}
        </div>
      )}

      {educations.filter((e) => e.institution || e.degree).length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <SectionHeading>Education</SectionHeading>
          {educations.map(
            (edu) =>
              (edu.institution || edu.degree) && (
                <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{edu.institution}</h3>
                    <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  </div>
                  {(edu.startDate || edu.endDate) && <span style={{ fontSize: '12px', color: BRASS, fontStyle: 'italic' }}>{edu.startDate} — {edu.endDate}</span>}
                </div>
              )
          )}
        </div>
      )}

      {skills.filter((s) => s.name).length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <SectionHeading>Core Competencies</SectionHeading>
          <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.9' }}>
            {skills.filter((s) => s.name).map((s) => s.name).join('   •   ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;

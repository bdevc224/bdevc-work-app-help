// FILE: src/templates/BoldTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const VIOLET = '#6d28d9';
const AMBER = '#f59e0b';
const INK = '#18181b';
const SANS = "'Helvetica Neue', Arial, sans-serif";

const BoldTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        style={{
          position: 'relative',
          backgroundColor: VIOLET,
          color: 'white',
          padding: '36px 40px 52px',
          clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" style={{ width: '78px', height: '78px', borderRadius: '14px', objectFit: 'cover', border: `3px solid ${AMBER}`, flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, lineHeight: 1.05 }}>{personalInfo.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: '15px', color: '#fde68a', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {personalInfo.jobTitle || 'Job Title'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '16px', fontSize: '12.5px', color: '#ede9fe' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      <div style={{ padding: '8px 40px 32px' }}>
        {personalInfo.summary && (
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '24px' }}>{personalInfo.summary}</p>
        )}

        {experiences.filter((e) => e.company || e.position).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ display: 'inline-block', backgroundColor: INK, color: 'white', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: '6px', marginBottom: '14px' }}>
              EXPERIENCE
            </span>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '16px', borderLeft: `4px solid ${AMBER}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: INK, margin: 0 }}>{exp.position || 'Position'}</h3>
                      {(exp.startDate || exp.endDate) && <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>{exp.startDate} — {exp.endDate}</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: VIOLET, fontWeight: 700, margin: '2px 0 6px' }}>{exp.company || 'Company'}</p>
                    {exp.description && <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.55', margin: 0 }}>{exp.description}</p>}
                  </div>
                )
            )}
          </div>
        )}

        {educations.filter((e) => e.institution || e.degree).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ display: 'inline-block', backgroundColor: INK, color: 'white', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: '6px', marginBottom: '14px' }}>
              EDUCATION
            </span>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: INK, margin: 0 }}>{edu.institution}</h3>
                    <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                      {edu.degree} {edu.field && `in ${edu.field}`} {(edu.startDate || edu.endDate) && `· ${edu.startDate} - ${edu.endDate}`}
                    </p>
                  </div>
                )
            )}
          </div>
        )}

        {skills.filter((s) => s.name).length > 0 && (
          <div>
            <span style={{ display: 'inline-block', backgroundColor: INK, color: 'white', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: '6px', marginBottom: '14px' }}>
              SKILLS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(
                (skill) =>
                  skill.name && (
                    <span key={skill.id} style={{ backgroundColor: '#f5f3ff', color: VIOLET, border: `1.5px solid ${VIOLET}`, padding: '4px 12px', borderRadius: '9999px', fontSize: '12.5px', fontWeight: 700 }}>
                      {skill.name}
                    </span>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldTemplate;

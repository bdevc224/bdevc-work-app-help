// FILE: src/templates/EditorialTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const INK = '#1c1c1c';
const TEAL = '#0f5257';
const BG = '#faf9f6';
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Arial, sans-serif";

const EditorialTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="shadow-xl rounded-lg overflow-hidden" style={{ backgroundColor: BG }}>
      <div style={{ padding: '36px 40px 22px', borderBottom: `3px double ${INK}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
        <div>
          <p style={{ fontFamily: SANS, fontSize: '11px', color: TEAL, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Curriculum Vitae</p>
          <h1 style={{ fontFamily: SERIF, fontSize: '40px', color: INK, margin: '4px 0 0', lineHeight: 1 }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontFamily: SERIF, fontSize: '16px', fontStyle: 'italic', color: '#4b5563', marginTop: '6px' }}>{personalInfo.jobTitle || 'Job Title'}</p>
        </div>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0 }} />
        )}
      </div>

      <div style={{ display: 'flex', padding: '28px 40px', gap: '32px', fontFamily: SANS }}>
        {/* Sidebar */}
        <div style={{ width: '30%', borderRight: `1px solid #d1d5db`, paddingRight: '24px' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: '13px', color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Contact</h2>
          <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.9', wordBreak: 'break-word' }}>
            {personalInfo.email && <p style={{ margin: 0 }}>{personalInfo.email}</p>}
            {personalInfo.phone && <p style={{ margin: 0 }}>{personalInfo.phone}</p>}
            {personalInfo.location && <p style={{ margin: 0 }}>{personalInfo.location}</p>}
            {personalInfo.website && <p style={{ margin: 0 }}>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p style={{ margin: 0 }}>{personalInfo.linkedin}</p>}
            {personalInfo.github && <p style={{ margin: 0 }}>{personalInfo.github}</p>}
          </div>

          {educations.filter((e) => e.institution || e.degree).length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h2 style={{ fontFamily: SERIF, fontSize: '13px', color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Education</h2>
              {educations.map(
                (edu) =>
                  (edu.institution || edu.degree) && (
                    <div key={edu.id} style={{ marginBottom: '10px', fontSize: '12px', color: '#374151' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{edu.degree}</p>
                      <p style={{ margin: 0 }}>{edu.field}</p>
                      <p style={{ margin: 0, color: '#6b7280' }}>{edu.institution}</p>
                    </div>
                  )
              )}
            </div>
          )}

          {skills.filter((s) => s.name).length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h2 style={{ fontFamily: SERIF, fontSize: '13px', color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Skills</h2>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.8' }}>
                {skills.filter((s) => s.name).map((s) => s.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ width: '70%' }}>
          {personalInfo.summary && (
            <p style={{ fontFamily: SERIF, fontSize: '15px', fontStyle: 'italic', color: '#374151', lineHeight: '1.7', marginBottom: '22px' }}>
              {personalInfo.summary}
            </p>
          )}

          {experiences.filter((e) => e.company || e.position).length > 0 && (
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: '15px', color: INK, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `1px solid ${INK}`, paddingBottom: '6px', marginBottom: '14px' }}>
                Experience
              </h2>
              {experiences.map(
                (exp) =>
                  (exp.company || exp.position) && (
                    <div key={exp.id} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: INK, margin: 0 }}>{exp.position || 'Position'}</h3>
                        {(exp.startDate || exp.endDate) && <span style={{ fontSize: '12px', color: '#6b7280' }}>{exp.startDate} – {exp.endDate}</span>}
                      </div>
                      <p style={{ fontSize: '13px', color: TEAL, fontWeight: 600, margin: '2px 0 6px' }}>{exp.company || 'Company'}</p>
                      {exp.description && <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{exp.description}</p>}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorialTemplate;

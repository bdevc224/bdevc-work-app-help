// FILE: src/templates/TechnicalTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';

const BG = '#0d1117';
const PANEL = '#161b22';
const TEXT = '#c9d1d9';
const BLUE = '#58a6ff';
const GREEN = '#3fb950';
const PURPLE = '#bc8cff';
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const CommentHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontFamily: MONO, fontSize: '12.5px', color: '#8b949e', marginBottom: '10px' }}>
    <span style={{ color: '#6e7681' }}>// </span>
    <span style={{ color: GREEN }}>{children}</span>
  </p>
);

const TechnicalTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="shadow-xl rounded-lg overflow-hidden" style={{ backgroundColor: BG, fontFamily: MONO, color: TEXT }}>
      {/* Fake editor tab bar */}
      <div style={{ backgroundColor: PANEL, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #21262d' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#ff5f56', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#ffbd2e', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#27c93f', display: 'inline-block' }} />
        <span style={{ fontSize: '12px', color: '#8b949e', marginLeft: '10px' }}>resume.ts</span>
      </div>

      <div style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: `1px solid #30363d`, flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', margin: 0 }}>
              <span style={{ color: PURPLE }}>const</span> <span style={{ color: BLUE }}>candidate</span> <span style={{ color: TEXT }}>=</span> <span style={{ color: '#e3b341' }}>{'{'}</span>
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#f0f6fc', margin: '4px 0 0 16px' }}>
              name: <span style={{ color: '#a5d6ff' }}>"{personalInfo.fullName || 'Your Name'}"</span>,
            </p>
            <p style={{ fontSize: '14px', color: GREEN, margin: '2px 0 0 16px' }}>
              role: <span style={{ color: '#a5d6ff' }}>"{personalInfo.jobTitle || 'Job Title'}"</span>,
            </p>
          </div>
        </div>

        <div style={{ marginLeft: '16px', fontSize: '12.5px', color: '#8b949e', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
          {personalInfo.email && <span>email: <span style={{ color: '#a5d6ff' }}>"{personalInfo.email}"</span></span>}
          {personalInfo.phone && <span>phone: <span style={{ color: '#a5d6ff' }}>"{personalInfo.phone}"</span></span>}
          {personalInfo.location && <span>location: <span style={{ color: '#a5d6ff' }}>"{personalInfo.location}"</span></span>}
          {personalInfo.github && <span>github: <span style={{ color: '#a5d6ff' }}>"{personalInfo.github}"</span></span>}
        </div>
        <p style={{ fontSize: '13px', color: '#e3b341', marginTop: '-10px', marginBottom: '24px' }}>{'};'}</p>

        {personalInfo.summary && (
          <div style={{ marginBottom: '24px' }}>
            <CommentHeading>summary</CommentHeading>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: TEXT }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.filter((e) => e.company || e.position).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <CommentHeading>experience</CommentHeading>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `2px solid #30363d` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontSize: '14px', color: '#f0f6fc', fontWeight: 700 }}>{exp.position || 'Position'}</span>
                      {(exp.startDate || exp.endDate) && <span style={{ fontSize: '11.5px', color: '#6e7681' }}>{exp.startDate} → {exp.endDate}</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: BLUE, margin: '2px 0 6px' }}>@{exp.company || 'company'}</p>
                    {exp.description && <p style={{ fontSize: '12.5px', color: '#8b949e', lineHeight: '1.6', margin: 0 }}>{exp.description}</p>}
                  </div>
                )
            )}
          </div>
        )}

        {educations.filter((e) => e.institution || e.degree).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <CommentHeading>education</CommentHeading>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#f0f6fc' }}>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span style={{ fontSize: '12.5px', color: '#6e7681' }}> — {edu.institution} {(edu.startDate || edu.endDate) && `(${edu.startDate}–${edu.endDate})`}</span>
                  </div>
                )
            )}
          </div>
        )}

        {skills.filter((s) => s.name).length > 0 && (
          <div>
            <CommentHeading>skills</CommentHeading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(
                (skill) =>
                  skill.name && (
                    <span
                      key={skill.id}
                      style={{ fontSize: '12px', backgroundColor: '#21262d', color: '#a5d6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #30363d' }}
                    >
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

export default TechnicalTemplate;

// FILE: src/templates/CompactTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';
import { DescriptionText } from '../components/FormattedText';
import LinksRow from '../components/LinksRow';
import ContactLine from '../components/ContactLine';

const SLATE = '#334155';
const SANS = "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif";

const CompactTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }) => {
  const bulletsFor = (section: 'experience' | 'projects') => Boolean(formatting?.enabled && formatting.sections[section]);
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ fontFamily: SANS, fontSize: '12px' }}>
      <div style={{ padding: '20px 28px', borderBottom: `2px solid ${SLATE}` }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: SLATE, margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{personalInfo.jobTitle || 'Job Title'}</p>
          <ContactLine personalInfo={personalInfo} separator="  |  " style={{ fontSize: '11px', color: '#6b7280', margin: 0 }} />
        </div>
      </div>

      <div style={{ display: 'flex', padding: '18px 28px', gap: '24px' }}>
        {/* Left column */}
        <div style={{ width: '32%', borderRight: '1px solid #e5e7eb', paddingRight: '18px' }}>
          {links.filter((l) => l.url.trim()).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Links</h2>
              <LinksRow
                links={links}
                direction="column"
                gap="0"
                style={{ color: '#4b5563', lineHeight: '1.7' }}
                linkStyle={{ color: '#4b5563', wordBreak: 'break-word', display: 'block' }}
              />
            </div>
          )}

          {educations.filter((e) => e.institution || e.degree).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Education</h2>
              {educations.map(
                (edu) =>
                  (edu.institution || edu.degree) && (
                    <div key={edu.id} style={{ marginBottom: '8px', color: '#374151' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{edu.degree}</p>
                      <p style={{ margin: 0 }}>{edu.field}</p>
                      <p style={{ margin: 0, color: '#6b7280' }}>{edu.institution}</p>
                      {(edu.startDate || edu.endDate) && <p style={{ margin: 0, color: '#9ca3af' }}>{edu.startDate} - {edu.endDate}</p>}
                    </div>
                  )
              )}
            </div>
          )}

          {skills.filter((s) => s.name).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Skills</h2>
              <ul style={{ margin: 0, paddingLeft: '14px', color: '#374151', lineHeight: '1.8' }}>
                {skills.filter((s) => s.name).map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {languages.filter((l) => l.name).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Languages</h2>
              <ul style={{ margin: 0, paddingLeft: '14px', color: '#374151', lineHeight: '1.8' }}>
                {languages.filter((l) => l.name).map((l) => (
                  <li key={l.id}>{l.name}{l.proficiency && ` — ${l.proficiency}`}</li>
                ))}
              </ul>
            </div>
          )}

          {certifications.filter((c) => c.name).length > 0 && (
            <div>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Certifications</h2>
              {certifications.map(
                (cert) =>
                  cert.name && (
                    <div key={cert.id} style={{ marginBottom: '8px', color: '#374151' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{cert.name}</p>
                      {cert.issuer && <p style={{ margin: 0, color: '#6b7280' }}>{cert.issuer}</p>}
                      {cert.date && <p style={{ margin: 0, color: '#9ca3af' }}>{cert.date}</p>}
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ width: '68%' }}>
          {personalInfo.summary && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Summary</h2>
              <p style={{ color: '#374151', lineHeight: '1.6', margin: 0 }}>{personalInfo.summary}</p>
            </div>
          )}

          {experiences.filter((e) => e.company || e.position).length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Experience</h2>
              {experiences.map(
                (exp) =>
                  (exp.company || exp.position) && (
                    <div key={exp.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#1f2937' }}>{exp.position || 'Position'} — {exp.company || 'Company'}</span>
                        {(exp.startDate || exp.endDate) && <span style={{ color: '#6b7280', fontSize: '11px' }}>{exp.startDate} - {exp.endDate}</span>}
                      </div>
                      {exp.description && (
                        <DescriptionText
                          text={exp.description}
                          bulleted={bulletsFor('experience')}
                          style={{ color: '#4b5563', lineHeight: '1.55', marginTop: '3px' }}
                        />
                      )}
                    </div>
                  )
              )}
            </div>
          )}

          {projects.filter((p) => p.name).length > 0 && (
            <div>
              <h2 style={{ fontSize: '11px', fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Projects</h2>
              {projects.map(
                (proj) =>
                  proj.name && (
                    <div key={proj.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#1f2937' }}>{proj.name}</span>
                        {proj.link && <span style={{ color: '#6b7280', fontSize: '11px' }}>{proj.link}</span>}
                      </div>
                      {proj.technologies && <p style={{ color: SLATE, fontSize: '11px', margin: '2px 0' }}>{proj.technologies}</p>}
                      {proj.description && (
                        <DescriptionText
                          text={proj.description}
                          bulleted={bulletsFor('projects')}
                          style={{ color: '#4b5563', lineHeight: '1.55', marginTop: '3px' }}
                        />
                      )}
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

export default CompactTemplate;

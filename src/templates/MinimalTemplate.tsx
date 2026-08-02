// FILE: src/templates/MinimalTemplate.tsx

import React from 'react';
import type { TemplateProps } from './types';
import { DescriptionText, VerticalList } from '../components/FormattedText';
import LinksRow from '../components/LinksRow';
import ContactLine from '../components/ContactLine';

const MinimalTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }) => {
  const bulletsFor = (section: 'experience' | 'projects' | 'skills' | 'languages') => Boolean(formatting?.enabled && formatting.sections[section]);
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ padding: '40px 44px', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '0.02em' }}>
          {(personalInfo.fullName || 'Your Name').toUpperCase()}
        </h1>
        <p style={{ fontSize: '15px', color: '#374151', marginTop: '4px' }}>{personalInfo.jobTitle || 'Job Title'}</p>
        <ContactLine personalInfo={personalInfo} style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }} />
        <LinksRow
          links={links}
          style={{ justifyContent: 'center', fontSize: '12px', marginTop: '2px' }}
          linkStyle={{ color: '#6b7280' }}
          gap="10px"
        />
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
                    {exp.description && (
                      <DescriptionText
                        text={exp.description}
                        bulleted={bulletsFor('experience')}
                        style={{ color: '#374151', fontSize: '13px', marginTop: '4px', lineHeight: '1.5' }}
                      />
                    )}
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

      {projects.filter((p) => p.name).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            PROJECTS
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {projects.map(
              (proj) =>
                proj.name && (
                  <div key={proj.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>{proj.name}</h3>
                      {proj.link && <span style={{ color: '#6b7280', fontSize: '12px' }}>{proj.link}</span>}
                    </div>
                    {proj.technologies && <p style={{ color: '#6b7280', fontSize: '12.5px', margin: '2px 0' }}>{proj.technologies}</p>}
                    {proj.description && (
                      <DescriptionText
                        text={proj.description}
                        bulleted={bulletsFor('projects')}
                        style={{ color: '#374151', fontSize: '13px', lineHeight: '1.5' }}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {skills.filter((s) => s.name).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            SKILLS
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {bulletsFor('skills') ? (
              <VerticalList
                items={skills.filter((s) => s.name).map((s) => ({ id: s.id, label: s.name }))}
                style={{ fontSize: '13px', color: '#374151' }}
              />
            ) : (
              <p style={{ fontSize: '13px', color: '#374151' }}>
                {skills.filter((s) => s.name).map((s) => s.name).join('  •  ')}
              </p>
            )}
          </div>
        </div>
      )}

      {certifications.filter((c) => c.name).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            CERTIFICATIONS
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {certifications.map(
              (cert) =>
                cert.name && (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#111827' }}>{cert.name}{cert.issuer && `, ${cert.issuer}`}</span>
                    {cert.date && <span style={{ color: '#6b7280', fontSize: '12.5px' }}>{cert.date}</span>}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {languages.filter((l) => l.name).length > 0 && (
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#111827', marginBottom: '10px' }}>
            LANGUAGES
          </h2>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
            {bulletsFor('languages') ? (
              <VerticalList
                items={languages.filter((l) => l.name).map((l) => ({ id: l.id, label: l.proficiency ? `${l.name} (${l.proficiency})` : l.name }))}
                style={{ fontSize: '13px', color: '#374151' }}
              />
            ) : (
              <p style={{ fontSize: '13px', color: '#374151' }}>
                {languages.filter((l) => l.name).map((l) => l.proficiency ? `${l.name} (${l.proficiency})` : l.name).join('  •  ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;

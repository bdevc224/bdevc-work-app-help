// FILE: src/templates/CreativeTemplate.tsx

import React from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import type { TemplateProps } from './types';
import { DescriptionText, VerticalList } from '../components/FormattedText';
import LinksRow from '../components/LinksRow';
import { telHref, mailtoHref, mapsHref } from '../lib/contactLinks';

const ACCENT = '#dc2626';
const ACCENT_SOFT = '#fee2e2';

const CreativeTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }) => {
  const bulletsFor = (section: 'experience' | 'projects' | 'skills' | 'languages') => Boolean(formatting?.enabled && formatting.sections[section]);
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div style={{ padding: '32px 28px 20px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `4px solid ${ACCENT}` }}>
        {personalInfo.photo ? (
          <img
            src={personalInfo.photo}
            alt=""
            style={{ width: '92px', height: '92px', borderRadius: '9999px', objectFit: 'cover', border: `4px solid ${ACCENT}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: '92px', height: '92px', borderRadius: '9999px', backgroundColor: ACCENT_SOFT, border: `4px solid ${ACCENT}`, flexShrink: 0 }} />
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#111827', margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '16px', color: ACCENT, fontWeight: 700, marginTop: '2px' }}>{(personalInfo.jobTitle || 'Job Title').toUpperCase()}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px', fontSize: '13px', color: '#4b5563' }}>
            {personalInfo.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail style={{ width: '13px', height: '13px' }} /><a href={mailtoHref(personalInfo.email)} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.email}</a></span>}
            {personalInfo.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone style={{ width: '13px', height: '13px' }} /><a href={telHref(personalInfo.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.phone}</a></span>}
            {personalInfo.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin style={{ width: '13px', height: '13px' }} /><a href={mapsHref(personalInfo.location)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.location}</a></span>}
          </div>
          <LinksRow links={links} style={{ marginTop: '6px', fontSize: '13px' }} linkStyle={{ color: ACCENT, fontWeight: 600 }} gap="14px" />
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '8px' }}>ABOUT ME</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.filter((exp) => exp.company || exp.position).length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase style={{ width: '14px', height: '14px' }} /> EXPERIENCE
            </h2>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '14px', backgroundColor: '#fafafa', borderRadius: '10px', padding: '12px 14px', borderLeft: `4px solid ${ACCENT}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{exp.position || 'Position'}</h3>
                        <p style={{ color: ACCENT, fontSize: '13px', fontWeight: 600, margin: 0 }}>{exp.company || 'Company'}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && <span style={{ color: '#6b7280', fontSize: '13px' }}>{exp.startDate} - {exp.endDate}</span>}
                    </div>
                    {exp.description && (
                      <DescriptionText
                        text={exp.description}
                        bulleted={bulletsFor('experience')}
                        style={{ color: '#4b5563', fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        )}

        {educations.filter((edu) => edu.institution || edu.degree).length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap style={{ width: '14px', height: '14px' }} /> EDUCATION
            </h2>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>{edu.institution}</h3>
                    <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>
                      {edu.degree} {edu.field && `in ${edu.field}`} {(edu.startDate || edu.endDate) && `· ${edu.startDate} - ${edu.endDate}`}
                    </p>
                  </div>
                )
            )}
          </div>
        )}

        {projects.filter((p) => p.name).length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px' }}>PROJECTS</h2>
            {projects.map(
              (proj) =>
                proj.name && (
                  <div key={proj.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>{proj.name}</h3>
                      {proj.link && <span style={{ color: '#6b7280', fontSize: '12px' }}>{proj.link}</span>}
                    </div>
                    {proj.technologies && <p style={{ color: ACCENT, fontSize: '12.5px', fontWeight: 600, margin: '2px 0' }}>{proj.technologies}</p>}
                    {proj.description && (
                      <DescriptionText
                        text={proj.description}
                        bulleted={bulletsFor('projects')}
                        style={{ color: '#4b5563', fontSize: '13px', lineHeight: '1.5' }}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        )}

        {skills.filter((s) => s.name).length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px' }}>SKILLS</h2>
            {bulletsFor('skills') ? (
              <VerticalList
                items={skills.filter((s) => s.name).map((s) => ({ id: s.id, label: s.name }))}
                style={{ color: '#374151', fontSize: '13px' }}
                markerColor={ACCENT}
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map(
                  (skill) =>
                    skill.name && (
                      <span key={skill.id} style={{ backgroundColor: ACCENT_SOFT, color: '#991b1b', padding: '5px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600 }}>
                        {skill.name}
                      </span>
                    )
                )}
              </div>
            )}
          </div>
        )}

        {certifications.filter((c) => c.name).length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px' }}>CERTIFICATIONS</h2>
            {certifications.map(
              (cert) =>
                cert.name && (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '14px' }}>{cert.name}</h3>
                      {cert.issuer && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{cert.issuer}</p>}
                    </div>
                    {cert.date && <span style={{ color: '#6b7280', fontSize: '13px' }}>{cert.date}</span>}
                  </div>
                )
            )}
          </div>
        )}

        {languages.filter((l) => l.name).length > 0 && (
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT, letterSpacing: '0.08em', marginBottom: '10px' }}>LANGUAGES</h2>
            {bulletsFor('languages') ? (
              <VerticalList
                items={languages.filter((l) => l.name).map((l) => ({ id: l.id, label: l.proficiency ? `${l.name} \u2014 ${l.proficiency}` : l.name }))}
                style={{ color: '#374151', fontSize: '13px' }}
                markerColor={ACCENT}
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {languages.map(
                  (lang) =>
                    lang.name && (
                      <span key={lang.id} style={{ backgroundColor: ACCENT_SOFT, color: '#991b1b', padding: '5px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600 }}>
                        {lang.name}{lang.proficiency && ` — ${lang.proficiency}`}
                      </span>
                    )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;

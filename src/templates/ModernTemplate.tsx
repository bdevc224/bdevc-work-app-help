// FILE: src/templates/ModernTemplate.tsx

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { TemplateProps } from './types';
import { DescriptionText, VerticalList } from '../components/FormattedText';
import LinksRow from '../components/LinksRow';
import { telHref, mailtoHref, mapsHref } from '../lib/contactLinks';

const ModernTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }) => {
  const bulletsFor = (section: 'experience' | 'projects' | 'skills' | 'languages') => Boolean(formatting?.enabled && formatting.sections[section]);
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ display: 'flex', minHeight: '600px' }}>
      {/* Sidebar */}
      <div style={{ width: '34%', backgroundColor: '#111827', color: '#e5e7eb', padding: '28px 20px' }}>
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt=""
            style={{ width: '96px', height: '96px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '3px solid #374151' }}
          />
        )}
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'white', textAlign: 'center', margin: 0 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p style={{ fontSize: '13px', color: '#93c5fd', textAlign: 'center', marginTop: '4px' }}>
          {personalInfo.jobTitle || 'Job Title'}
        </p>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
              <Mail style={{ width: '13px', height: '13px', flexShrink: 0 }} /> <a href={mailtoHref(personalInfo.email)} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.email}</a>
            </div>
          )}
          {personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone style={{ width: '13px', height: '13px', flexShrink: 0 }} /> <a href={telHref(personalInfo.phone)} style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.phone}</a>
            </div>
          )}
          {personalInfo.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin style={{ width: '13px', height: '13px', flexShrink: 0 }} /> <a href={mapsHref(personalInfo.location)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{personalInfo.location}</a>
            </div>
          )}
          <LinksRow
            links={links}
            direction="column"
            gap="4px"
            style={{ fontSize: '12px' }}
            linkStyle={{ color: '#e5e7eb', wordBreak: 'break-all' }}
          />
        </div>

        {educations.filter((e) => e.institution || e.degree).length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #374151', paddingBottom: '6px', marginBottom: '10px' }}>
              Education
            </h2>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '12px', fontSize: '12px' }}>
                    <p style={{ fontWeight: 600, color: 'white', margin: 0 }}>{edu.degree}</p>
                    <p style={{ color: '#9ca3af', margin: 0 }}>{edu.field}</p>
                    <p style={{ color: '#9ca3af', margin: 0 }}>{edu.institution}</p>
                    {(edu.startDate || edu.endDate) && (
                      <p style={{ color: '#6b7280', margin: 0 }}>{edu.startDate} - {edu.endDate}</p>
                    )}
                  </div>
                )
            )}
          </div>
        )}

        {skills.filter((s) => s.name).length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #374151', paddingBottom: '6px', marginBottom: '10px' }}>
              Skills
            </h2>
            {bulletsFor('skills') ? (
              <VerticalList
                items={skills.filter((s) => s.name).map((s) => ({ id: s.id, label: s.name }))}
                style={{ color: '#e5e7eb', fontSize: '12px' }}
                markerColor="#93c5fd"
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map(
                  (skill) =>
                    skill.name && (
                      <span
                        key={skill.id}
                        style={{ fontSize: '11.5px', backgroundColor: '#1f2937', color: '#e5e7eb', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #374151' }}
                      >
                        {skill.name}
                      </span>
                    )
                )}
              </div>
            )}
          </div>
        )}

        {languages.filter((l) => l.name).length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #374151', paddingBottom: '6px', marginBottom: '10px' }}>
              Languages
            </h2>
            {bulletsFor('languages') ? (
              <VerticalList
                items={languages.filter((l) => l.name).map((l) => ({ id: l.id, label: l.proficiency ? `${l.name} \u2014 ${l.proficiency}` : l.name }))}
                style={{ color: '#e5e7eb', fontSize: '12px' }}
                markerColor="#93c5fd"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {languages.map(
                  (lang) =>
                    lang.name && (
                      <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{lang.name}</span>
                        {lang.proficiency && <span style={{ color: '#9ca3af' }}>{lang.proficiency}</span>}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main column */}
      <div style={{ width: '66%', padding: '28px 24px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Summary</h2>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.filter((exp) => exp.company || exp.position).length > 0 && (
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>Experience</h2>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '16px', borderLeft: '2px solid #60a5fa', paddingLeft: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{exp.position || 'Position'}</h3>
                        <p style={{ color: '#2563eb', fontSize: '14px', margin: 0 }}>{exp.company || 'Company'}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{exp.startDate} - {exp.endDate}</p>
                      )}
                    </div>
                    {exp.description && (
                      <DescriptionText
                        text={exp.description}
                        bulleted={bulletsFor('experience')}
                        style={{ color: '#4b5563', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        )}

        {projects.filter((p) => p.name).length > 0 && (
          <div style={{ marginTop: '22px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>Projects</h2>
            {projects.map(
              (proj) =>
                proj.name && (
                  <div key={proj.id} style={{ marginBottom: '14px', borderLeft: '2px solid #60a5fa', paddingLeft: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <h3 style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{proj.name}</h3>
                      {proj.link && <span style={{ color: '#6b7280', fontSize: '12px' }}>{proj.link}</span>}
                    </div>
                    {proj.technologies && <p style={{ color: '#2563eb', fontSize: '13px', margin: '2px 0 4px' }}>{proj.technologies}</p>}
                    {proj.description && (
                      <DescriptionText
                        text={proj.description}
                        bulleted={bulletsFor('projects')}
                        style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}
                      />
                    )}
                  </div>
                )
            )}
          </div>
        )}

        {certifications.filter((c) => c.name).length > 0 && (
          <div style={{ marginTop: '22px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>Certifications</h2>
            {certifications.map(
              (cert) =>
                cert.name && (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '14px' }}>{cert.name}</h3>
                      {cert.issuer && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{cert.issuer}</p>}
                    </div>
                    {cert.date && <span style={{ color: '#6b7280', fontSize: '13px' }}>{cert.date}</span>}
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;

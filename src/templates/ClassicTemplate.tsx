// FILE: src/templates/ClassicTemplate.tsx

import React from 'react';
import { Briefcase, GraduationCap, Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { TemplateProps } from './types';

const ClassicTemplate: React.FC<TemplateProps> = ({ personalInfo, experiences, educations, skills }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div
        className="resume-header"
        style={{
          backgroundColor: '#1e40af',
          color: 'white',
          padding: '32px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt=""
            style={{ width: '84px', height: '84px', borderRadius: '9999px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.7)' }}
          />
        )}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '18px', color: '#bfdbfe', marginTop: '4px', marginBottom: 0 }}>{personalInfo.jobTitle || 'Job Title'}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', fontSize: '14px', color: '#bfdbfe' }}>
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail style={{ width: '14px', height: '14px' }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone style={{ width: '14px', height: '14px' }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin style={{ width: '14px', height: '14px' }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
          {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '14px', color: '#bfdbfe' }}>
              {personalInfo.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe style={{ width: '14px', height: '14px' }} />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              {personalInfo.github && <span>{personalInfo.github}</span>}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
              Professional Summary
            </h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.filter((exp) => exp.company || exp.position).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase style={{ width: '16px', height: '16px' }} />
              Work Experience
            </h2>
            {experiences.map(
              (exp) =>
                (exp.company || exp.position) && (
                  <div key={exp.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, color: '#1f2937', margin: 0 }}>{exp.position || 'Position'}</h3>
                        <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: 500, margin: 0 }}>{exp.company || 'Company'}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                          {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                        </p>
                      )}
                    </div>
                    {exp.description && <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>{exp.description}</p>}
                  </div>
                )
            )}
          </div>
        )}

        {educations.filter((edu) => edu.institution || edu.degree).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap style={{ width: '16px', height: '16px' }} />
              Education
            </h2>
            {educations.map(
              (edu) =>
                (edu.institution || edu.degree) && (
                  <div key={edu.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, color: '#1f2937', margin: 0 }}>{edu.institution || 'Institution'}</h3>
                        <p style={{ color: '#374151', fontSize: '14px', margin: 0 }}>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </p>
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                          {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                        </p>
                      )}
                    </div>
                    {edu.gpa && <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>GPA: {edu.gpa}</p>}
                  </div>
                )
            )}
          </div>
        )}

        {skills.filter((s) => s.name).length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(
                (skill) =>
                  skill.name && (
                    <div key={skill.id} style={{ backgroundColor: '#f3f4f6', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', color: '#374151' }}>
                      {skill.name}
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;

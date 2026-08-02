// FILE: src/components/ContactLine.tsx

import React from 'react';
import type { PersonalInfo } from '../types/resume';
import { telHref, mailtoHref, mapsHref } from '../lib/contactLinks';

interface ContactLineProps {
  personalInfo: PersonalInfo;
  separator?: string;
  style?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
}

/**
 * Renders email/phone/location as individual clickable links (mailto:/tel:/
 * maps) with a separator between them, visually equivalent to the old
 * `[email, phone, location].join(separator)` plain-text line but with each
 * piece independently clickable.
 */
const ContactLine: React.FC<ContactLineProps> = ({ personalInfo, separator = '   •   ', style, linkStyle }) => {
  const items: { key: string; href: string; label: string; external?: boolean }[] = [];
  if (personalInfo.email) items.push({ key: 'email', href: mailtoHref(personalInfo.email), label: personalInfo.email });
  if (personalInfo.phone) items.push({ key: 'phone', href: telHref(personalInfo.phone), label: personalInfo.phone });
  if (personalInfo.location) items.push({ key: 'location', href: mapsHref(personalInfo.location), label: personalInfo.location, external: true });

  if (items.length === 0) return null;

  return (
    <p style={style}>
      {items.map((item, idx) => (
        <React.Fragment key={item.key}>
          {idx > 0 && separator}
          <a
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            style={{ color: 'inherit', textDecoration: 'none', ...linkStyle }}
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </p>
  );
};

export default ContactLine;

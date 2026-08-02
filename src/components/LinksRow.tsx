// FILE: src/components/LinksRow.tsx

import React from 'react';
import type { SocialLink } from '../types/resume';
import { linkLabel, normalizeLinkUrl } from '../types/resume';

interface LinksRowProps {
  links: SocialLink[];
  /** container style */
  style?: React.CSSProperties;
  /** style applied to each <a> */
  linkStyle?: React.CSSProperties;
  direction?: 'row' | 'column';
  gap?: string;
}

/**
 * Renders each link as its platform name (e.g. "LinkedIn"), not the raw URL,
 * as a real <a href> - clickable on screen, preserved as a real hyperlink
 * when copied to clipboard/Word, and picked up by the PDF exporters (which
 * scan for <a> tags in this component's DOM to place clickable regions).
 */
const LinksRow: React.FC<LinksRowProps> = ({ links, style, linkStyle, direction = 'row', gap = '14px' }) => {
  const validLinks = links.filter((l) => l.url.trim());
  if (validLinks.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap', gap, ...style }}>
      {validLinks.map((link) => (
        <a
          key={link.id}
          href={normalizeLinkUrl(link.url)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', ...linkStyle }}
        >
          {linkLabel(link)}
        </a>
      ))}
    </div>
  );
};

export default LinksRow;

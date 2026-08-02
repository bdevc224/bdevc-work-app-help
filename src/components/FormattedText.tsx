// FILE: src/components/FormattedText.tsx

import React from 'react';
import { parseBoldSegments, getTextLines } from '../lib/textFormat';

/** Renders one line of text with `**bold**` markers converted to <strong>. */
export const InlineFormatted: React.FC<{ text: string }> = ({ text }) => {
  const segments = parseBoldSegments(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.bold ? <strong key={i}>{seg.text}</strong> : <React.Fragment key={i}>{seg.text}</React.Fragment>
      )}
    </>
  );
};

interface DescriptionTextProps {
  text: string;
  /** when true, each line renders as its own bullet point; when false,
   *  renders as a single block with line breaks preserved */
  bulleted: boolean;
  style?: React.CSSProperties;
  bulletColor?: string;
}

/** Renders a description field (Experience/Project), honoring the resume's
 *  formatting settings: bold markup always parses, bullets are opt-in. */
export const DescriptionText: React.FC<DescriptionTextProps> = ({ text, bulleted, style, bulletColor }) => {
  if (!text) return null;

  if (bulleted) {
    const lines = getTextLines(text);
    if (lines.length === 0) return null;
    return (
      <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', ...style }}>
        {lines.map((line, i) => (
          <li key={i} style={{ marginBottom: i < lines.length - 1 ? '3px' : 0 }}>
            <span style={bulletColor ? { color: bulletColor } : undefined}>
              <InlineFormatted text={line} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p style={{ margin: 0, whiteSpace: 'pre-line', ...style }}>
      <InlineFormatted text={text} />
    </p>
  );
};

interface VerticalListProps {
  items: { id: string; label: string }[];
  style?: React.CSSProperties;
  markerColor?: string;
}

/** Renders Skills/Languages as a vertical bulleted list instead of the
 *  default horizontal tag cloud, when that section's toggle is on. */
export const VerticalList: React.FC<VerticalListProps> = ({ items, style, markerColor }) => {
  if (items.length === 0) return null;
  return (
    <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', ...style }}>
      {items.map((item) => (
        <li key={item.id} style={{ marginBottom: '3px', ...(markerColor ? { color: markerColor } : {}) }}>
          {item.label}
        </li>
      ))}
    </ul>
  );
};

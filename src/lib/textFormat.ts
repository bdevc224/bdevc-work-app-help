// FILE: src/lib/textFormat.ts
// Minimal, deliberately non-WYSIWYG text formatting: `**bold**` markup and
// one-bullet-per-line. Kept as plain typed syntax (not a rich-text editor)
// so it stays simple to type, simple to parse identically across DOM
// templates, jsPDF text output, and clipboard export, and never risks
// producing markup that breaks ATS parsing.

export interface BoldSegment {
  text: string;
  bold: boolean;
}

/** Splits a line on `**bold**` markers into plain/bold segments. Unmatched
 *  or stray `**` are treated as literal text rather than throwing. */
export function parseBoldSegments(line: string): BoldSegment[] {
  if (!line) return [];
  const segments: BoldSegment[] = [];
  const parts = line.split(/\*\*(.+?)\*\*/g);
  // String.split with a capturing group alternates: [plain, bold, plain, bold, ...]
  parts.forEach((part, i) => {
    if (part === '') return;
    segments.push({ text: part, bold: i % 2 === 1 });
  });
  return segments;
}

/** Splits free-text into non-empty, trimmed lines - each line becomes one
 *  bullet point when bulleted rendering is enabled for that section. */
export function getTextLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

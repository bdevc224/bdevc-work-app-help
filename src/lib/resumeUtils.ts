// FILE: src/lib/resumeUtils.ts

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { PersonalInfo, Experience, Education, Skill, Project, Certification, LanguageItem, SocialLink, FormattingOptions } from '../types/resume';
import { linkLabel, normalizeLinkUrl } from '../types/resume';
import { getTextLines, parseBoldSegments } from './textFormat';
import { telHref, mailtoHref, mapsHref } from './contactLinks';

function sectionBulleted(formatting: FormattingOptions | undefined, section: 'experience' | 'projects' | 'skills' | 'languages'): boolean {
  return Boolean(formatting?.enabled && formatting.sections[section]);
}

/** Render a DOM node (the resume preview) to a downloadable PDF. Any <a> tags
 *  inside the node (e.g. from LinksRow) get real clickable regions placed on
 *  top of the flattened image at matching coordinates - the image itself has
 *  no clickable areas since it's a rasterized screenshot, so this is done as
 *  a separate invisible overlay using each link's on-page position. */
export async function exportNodeToPDF(node: HTMLElement, filenameBase: string) {
  const cloneElement = node.cloneNode(true) as HTMLElement;
  cloneElement.style.position = 'absolute';
  cloneElement.style.top = '-9999px';
  cloneElement.style.left = '-9999px';
  cloneElement.style.width = `${node.offsetWidth || 800}px`;
  cloneElement.style.backgroundColor = '#ffffff';

  document.body.appendChild(cloneElement);

  try {
    // Capture link positions (relative to the node) before screenshotting -
    // getBoundingClientRect gives viewport coords, so subtract the node's own
    // origin to get position within the resume itself.
    const nodeRect = cloneElement.getBoundingClientRect();
    const linkRegions = Array.from(cloneElement.querySelectorAll('a[href]')).map((a) => {
      const r = (a as HTMLElement).getBoundingClientRect();
      return {
        url: (a as HTMLAnchorElement).href,
        x: r.left - nodeRect.left,
        y: r.top - nodeRect.top,
        width: r.width,
        height: r.height,
      };
    });

    const canvas = await html2canvas(cloneElement, {
      scale: 2.5,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const imgWidth = 180;
    const pageHeight = 277;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    // px-to-mm scale factor for the captured node, so link regions (captured
    // in CSS px) can be placed at the right spot on the mm-based PDF page.
    const pxToMm = imgWidth / nodeRect.width;
    const topMargin = 10;
    const leftMargin = 15;

    let heightLeft = imgHeight;
    let position = 0;
    let pageIndex = 0;

    const placeLinksForPage = (yOffsetMm: number) => {
      linkRegions.forEach((region) => {
        const x = leftMargin + region.x * pxToMm;
        const y = yOffsetMm + topMargin + region.y * pxToMm;
        const w = region.width * pxToMm;
        const h = region.height * pxToMm;
        // Only place the link annotation on the page it actually falls on
        if (y + h >= 0 && y <= pageHeight) {
          pdf.link(x, Math.max(y, 0), w, h, { url: region.url });
        }
      });
    };

    pdf.addImage(imgData, 'PNG', leftMargin, position + topMargin, imgWidth, imgHeight);
    placeLinksForPage(position);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pageIndex += 1;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', leftMargin, position + topMargin, imgWidth, imgHeight);
      placeLinksForPage(position);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filenameBase.replace(/\s/g, '_') || 'Resume'}.pdf`);
  } finally {
    document.body.removeChild(cloneElement);
  }
}

interface ClipboardArgs {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: LanguageItem[];
  links?: SocialLink[];
  formatting?: FormattingOptions;
}

/** Renders a description field as HTML: a <ul> of bullet lines when that
 *  section's formatting is on, otherwise a single paragraph. `**bold**`
 *  markup always converts to <strong> either way. */
function descriptionToHTML(text: string, bulleted: boolean): string {
  if (!text) return '';
  const toHTML = (line: string) =>
    parseBoldSegments(line)
      .map((seg) => (seg.bold ? `<strong>${seg.text}</strong>` : seg.text))
      .join('');
  if (bulleted) {
    const lines = getTextLines(text);
    if (lines.length === 0) return '';
    return `<ul style="margin: 4px 0 0; padding-left: 18px;">${lines.map((l) => `<li>${toHTML(l)}</li>`).join('')}</ul>`;
  }
  return `<p style="color: #374151; margin-top: 8px;">${toHTML(text)}</p>`;
}

/** Strips `**bold**` markers for plain text (no bold rendering possible there). */
function stripBoldMarkup(line: string): string {
  return parseBoldSegments(line).map((seg) => seg.text).join('');
}

/** Renders a description field as plain text: one "• line" per line when
 *  that section's formatting is on, otherwise the text as-is (bold markers
 *  stripped either way, since plain text can't render them). */
function descriptionToPlain(text: string, bulleted: boolean): string {
  if (!text) return '';
  if (bulleted) {
    return getTextLines(text).map((l) => `\u2022 ${stripBoldMarkup(l)}`).join('\n');
  }
  return stripBoldMarkup(text);
}

function generateHTMLText({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }: ClipboardArgs): string {
  const sections: string[] = [];
  sections.push(`<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">`);
  sections.push(`<div style="text-align: center; margin-bottom: 20px;">`);
  sections.push(`<h1 style="color: #1e40af; margin-bottom: 5px;">${personalInfo.fullName || 'NAME'}</h1>`);
  sections.push(`<h2 style="color: #3b82f6; font-size: 18px; margin-top: 0;">${personalInfo.jobTitle || 'JOB TITLE'}</h2>`);
  sections.push(`<div style="color: #4b5563; font-size: 12px; margin-top: 10px;">`);
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(`<a href="${mailtoHref(personalInfo.email)}" style="color: #4b5563;">${personalInfo.email}</a>`);
  if (personalInfo.phone) contacts.push(`<a href="${telHref(personalInfo.phone)}" style="color: #4b5563;">${personalInfo.phone}</a>`);
  if (personalInfo.location) contacts.push(`<a href="${mapsHref(personalInfo.location)}" style="color: #4b5563;">${personalInfo.location}</a>`);
  sections.push(contacts.join(' | '));
  sections.push(`</div>`);
  const validLinksHeader = links.filter((l) => l.url.trim());
  if (validLinksHeader.length > 0) {
    sections.push(`<div style="color: #3b82f6; font-size: 12px; margin-top: 4px;">`);
    sections.push(
      validLinksHeader
        .map((l) => `<a href="${normalizeLinkUrl(l.url)}" style="color: #3b82f6;">${linkLabel(l)}</a>`)
        .join(' &nbsp;|&nbsp; ')
    );
    sections.push(`</div>`);
  }
  sections.push(`</div>`);

  if (personalInfo.summary) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h3>`);
    sections.push(`<p style="color: #374151; line-height: 1.5;">${personalInfo.summary}</p></div>`);
  }

  const validExperiences = experiences.filter((exp) => exp.company || exp.position);
  if (validExperiences.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">WORK EXPERIENCE</h3>`);
    validExperiences.forEach((exp) => {
      sections.push(`<div style="margin-bottom: 15px;"><div style="display: flex; justify-content: space-between; flex-wrap: wrap;"><div>`);
      sections.push(`<strong style="color: #1f2937;">${exp.position || 'Position'}</strong><br><span style="color: #3b82f6;">${exp.company || 'Company'}</span></div>`);
      if (exp.startDate || exp.endDate) {
        sections.push(`<span style="color: #6b7280;">${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}</span>`);
      }
      sections.push(`</div>`);
      if (exp.description) sections.push(descriptionToHTML(exp.description, sectionBulleted(formatting, 'experience')));
      sections.push(`</div>`);
    });
    sections.push(`</div>`);
  }

  const validEducations = educations.filter((edu) => edu.institution || edu.degree);
  if (validEducations.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">EDUCATION</h3>`);
    validEducations.forEach((edu) => {
      sections.push(`<div style="margin-bottom: 15px;"><div style="display: flex; justify-content: space-between; flex-wrap: wrap;"><div>`);
      sections.push(`<strong style="color: #1f2937;">${edu.institution || 'Institution'}</strong><br><span>${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}</span></div>`);
      if (edu.startDate || edu.endDate) {
        sections.push(`<span style="color: #6b7280;">${edu.startDate || 'Start'} - ${edu.endDate || 'End'}</span>`);
      }
      sections.push(`</div>`);
      if (edu.gpa) sections.push(`<p style="color: #6b7280; margin-top: 5px;">GPA: ${edu.gpa}</p>`);
      sections.push(`</div>`);
    });
    sections.push(`</div>`);
  }

  const validSkills = skills.filter((s) => s.name);
  if (validSkills.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">SKILLS</h3>`);
    if (sectionBulleted(formatting, 'skills')) {
      sections.push(`<ul style="margin: 4px 0 0; padding-left: 18px;">`);
      validSkills.forEach((skill) => sections.push(`<li>${skill.name}</li>`));
      sections.push(`</ul>`);
    } else {
      sections.push(`<div style="display: flex; flex-wrap: wrap; gap: 8px;">`);
      validSkills.forEach((skill) => {
        sections.push(`<span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${skill.name}</span>`);
      });
      sections.push(`</div>`);
    }
    sections.push(`</div>`);
  }

  const validProjects = projects.filter((p) => p.name);
  if (validProjects.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">PROJECTS</h3>`);
    validProjects.forEach((proj) => {
      sections.push(`<div style="margin-bottom: 12px;"><strong style="color: #1f2937;">${proj.name}</strong>`);
      if (proj.technologies) sections.push(`<div style="color: #3b82f6; font-size: 13px;">${proj.technologies}</div>`);
      if (proj.link) sections.push(`<div style="color: #6b7280; font-size: 13px;">${proj.link}</div>`);
      if (proj.description) sections.push(descriptionToHTML(proj.description, sectionBulleted(formatting, 'projects')));
      sections.push(`</div>`);
    });
    sections.push(`</div>`);
  }

  const validCertifications = certifications.filter((c) => c.name);
  if (validCertifications.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">CERTIFICATIONS</h3>`);
    validCertifications.forEach((cert) => {
      sections.push(`<div style="margin-bottom: 6px;"><strong style="color: #1f2937;">${cert.name}</strong>`);
      const meta = [cert.issuer, cert.date].filter(Boolean).join(' \u2014 ');
      if (meta) sections.push(`<span style="color: #6b7280; font-size: 13px;"> (${meta})</span>`);
      sections.push(`</div>`);
    });
    sections.push(`</div>`);
  }

  const validLanguages = languages.filter((l) => l.name);
  if (validLanguages.length > 0) {
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">LANGUAGES</h3>`);
    if (sectionBulleted(formatting, 'languages')) {
      sections.push(`<ul style="margin: 4px 0 0; padding-left: 18px;">`);
      validLanguages.forEach((lang) => sections.push(`<li>${lang.name}${lang.proficiency ? ` \u2014 ${lang.proficiency}` : ''}</li>`));
      sections.push(`</ul>`);
    } else {
      sections.push(`<div style="display: flex; flex-wrap: wrap; gap: 8px;">`);
      validLanguages.forEach((lang) => {
        sections.push(`<span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${lang.name}${lang.proficiency ? ` \u2014 ${lang.proficiency}` : ''}</span>`);
      });
      sections.push(`</div>`);
    }
    sections.push(`</div>`);
  }

  sections.push(`</div>`);
  return sections.join('');
}

function generatePlainText({ personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting }: ClipboardArgs): string {
  const lines: string[] = [];
  lines.push(personalInfo.fullName || 'NAME');
  lines.push(personalInfo.jobTitle || 'JOB TITLE');
  lines.push('');

  const contactInfo: string[] = [];
  if (personalInfo.email) contactInfo.push(`Email: ${personalInfo.email}`);
  if (personalInfo.phone) contactInfo.push(`Phone: ${personalInfo.phone}`);
  if (personalInfo.location) contactInfo.push(`Location: ${personalInfo.location}`);
  if (contactInfo.length > 0) lines.push(contactInfo.join('  |  '));
  const validLinksPlain = links.filter((l) => l.url.trim());
  if (validLinksPlain.length > 0) {
    lines.push(validLinksPlain.map((l) => `${linkLabel(l)}: ${normalizeLinkUrl(l.url)}`).join('  |  '));
  }
  lines.push('');

  if (personalInfo.summary) {
    lines.push('PROFESSIONAL SUMMARY', '-'.repeat(50), personalInfo.summary, '');
  }

  const validExperiences = experiences.filter((exp) => exp.company || exp.position);
  if (validExperiences.length > 0) {
    lines.push('WORK EXPERIENCE', '-'.repeat(50));
    validExperiences.forEach((exp) => {
      lines.push(`${exp.position || 'Position'} at ${exp.company || 'Company'}`);
      if (exp.startDate || exp.endDate) lines.push(`${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}`);
      if (exp.description) lines.push(descriptionToPlain(exp.description, sectionBulleted(formatting, 'experience')));
      lines.push('');
    });
  }

  const validEducations = educations.filter((edu) => edu.institution || edu.degree);
  if (validEducations.length > 0) {
    lines.push('EDUCATION', '-'.repeat(50));
    validEducations.forEach((edu) => {
      lines.push(`${edu.degree || 'Degree'} in ${edu.field || 'Field'}`);
      lines.push(edu.institution || 'Institution');
      if (edu.startDate || edu.endDate) lines.push(`${edu.startDate || 'Start'} - ${edu.endDate || 'End'}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      lines.push('');
    });
  }

  const validSkills = skills.filter((s) => s.name);
  if (validSkills.length > 0) {
    lines.push('SKILLS', '-'.repeat(50));
    if (sectionBulleted(formatting, 'skills')) {
      validSkills.forEach((s) => lines.push(`\u2022 ${s.name}`));
    } else {
      lines.push(validSkills.map((s) => s.name).join(', '));
    }
    lines.push('');
  }

  const validProjects = projects.filter((p) => p.name);
  if (validProjects.length > 0) {
    lines.push('PROJECTS', '-'.repeat(50));
    validProjects.forEach((proj) => {
      lines.push(proj.name);
      if (proj.technologies) lines.push(proj.technologies);
      if (proj.link) lines.push(proj.link);
      if (proj.description) lines.push(descriptionToPlain(proj.description, sectionBulleted(formatting, 'projects')));
      lines.push('');
    });
  }

  const validCertifications = certifications.filter((c) => c.name);
  if (validCertifications.length > 0) {
    lines.push('CERTIFICATIONS', '-'.repeat(50));
    validCertifications.forEach((cert) => {
      const meta = [cert.issuer, cert.date].filter(Boolean).join(' \u2014 ');
      lines.push(meta ? `${cert.name} (${meta})` : cert.name);
    });
    lines.push('');
  }

  const validLanguages = languages.filter((l) => l.name);
  if (validLanguages.length > 0) {
    lines.push('LANGUAGES', '-'.repeat(50));
    if (sectionBulleted(formatting, 'languages')) {
      validLanguages.forEach((l) => lines.push(`\u2022 ${l.proficiency ? `${l.name} (${l.proficiency})` : l.name}`));
    } else {
      lines.push(validLanguages.map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name)).join(', '));
    }
  }

  return lines.join('\n');
}

interface ATSExportArgs {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: LanguageItem[];
  links?: SocialLink[];
  formatting?: FormattingOptions;
}

/**
 * Renders a clean, single-column PDF using jsPDF's native text API - no
 * html2canvas, no screenshotting. Every word is real, selectable, copyable
 * text laid out directly on the PDF page. This is what most Applicant
 * Tracking Systems (ATS) actually need to parse a resume; a rasterized
 * image export (see exportNodeToPDF) looks identical to a human but is
 * unreadable to that software regardless of which visual template was used
 * on screen. Layout is intentionally template-agnostic and unstyled beyond
 * basic hierarchy, since ATS parsers do best with the simplest structure.
 */
export function exportATSFriendlyPDF(args: ATSExportArgs, filenameBase: string) {
  const { personalInfo, experiences, educations, skills, projects = [], certifications = [], languages = [], links = [], formatting } = args;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const marginX = 18;
  const pageWidth = 210;
  const pageHeight = 297;
  const bottomMargin = 18;
  const contentWidth = pageWidth - marginX * 2;
  let y = 20;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - bottomMargin) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionHeading = (label: string) => {
    ensureSpace(11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(label.toUpperCase(), marginX, y);
    y += 1.5;
    doc.setDrawColor(130, 130, 130);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 6;
  };

  const wrappedText = (text: string, fontSize = 10, lineHeight = 4.8, style: 'normal' | 'bold' | 'italic' = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(45, 45, 45);
    const lines = doc.splitTextToSize(text, contentWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, marginX, y);
      y += lineHeight;
    });
  };

  const isBulleted = (section: 'experience' | 'projects' | 'skills' | 'languages') =>
    Boolean(formatting?.enabled && formatting.sections[section]);

  /** Word-wraps text with **bold** words rendered in a bold font run,
   *  greedy-wrapping by measured width since jsPDF has no rich-text runs. */
  const renderWrappedWords = (lineText: string, fontSize: number, lineHeight: number, startIndent: number) => {
    const words: { word: string; bold: boolean }[] = [];
    parseBoldSegments(lineText).forEach((seg) => {
      seg.text.split(' ').forEach((w) => {
        if (w) words.push({ word: w, bold: seg.bold });
      });
    });
    doc.setFontSize(fontSize);
    let cursorX = marginX + startIndent;
    ensureSpace(lineHeight);
    words.forEach((w) => {
      doc.setFont('helvetica', w.bold ? 'bold' : 'normal');
      const wordWidth = doc.getTextWidth(w.word);
      const spaceWidth = doc.getTextWidth(' ');
      if (cursorX + wordWidth > marginX + contentWidth && cursorX > marginX + startIndent) {
        y += lineHeight;
        ensureSpace(lineHeight);
        cursorX = marginX + startIndent;
      }
      doc.setTextColor(45, 45, 45);
      doc.text(w.word, cursorX, y);
      cursorX += wordWidth + spaceWidth;
    });
    y += lineHeight;
  };

  /** Renders a description field: one bullet per line when bulleted is on
   *  (each line hanging-indented so wraps line up under the text, not the
   *  bullet), a single wrapped paragraph otherwise. `**bold**` words render
   *  bold either way. */
  const renderDescription = (text: string, bulleted: boolean, fontSize = 9.5, lineHeight = 4.6) => {
    if (!text) return;
    const bulletIndent = 4;
    if (bulleted) {
      getTextLines(text).forEach((line) => {
        ensureSpace(lineHeight);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(45, 45, 45);
        doc.text('\u2022', marginX, y);
        renderWrappedWords(line, fontSize, lineHeight, bulletIndent);
      });
    } else {
      renderWrappedWords(text, fontSize, lineHeight, 0);
    }
  };

  // Name + title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(10, 10, 10);
  doc.text(personalInfo.fullName || 'Your Name', marginX, y);
  y += 7;

  if (personalInfo.jobTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(70, 70, 70);
    doc.text(personalInfo.jobTitle, marginX, y);
    y += 6;
  }

  // Contact line - each piece is individually clickable (mailto:/tel:/maps)
  const contactItems: { label: string; href: string }[] = [];
  if (personalInfo.email) contactItems.push({ label: personalInfo.email, href: mailtoHref(personalInfo.email) });
  if (personalInfo.phone) contactItems.push({ label: personalInfo.phone, href: telHref(personalInfo.phone) });
  if (personalInfo.location) contactItems.push({ label: personalInfo.location, href: mapsHref(personalInfo.location) });
  if (contactItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const contactSep = '   |   ';
    const contactSepWidth = doc.getTextWidth(contactSep);
    let cursorX = marginX;
    contactItems.forEach((item, idx) => {
      const labelWidth = doc.getTextWidth(item.label);
      if (cursorX + labelWidth > marginX + contentWidth && cursorX > marginX) {
        y += 4.6;
        cursorX = marginX;
      }
      doc.setTextColor(90, 90, 90);
      doc.textWithLink(item.label, cursorX, y, { url: item.href });
      cursorX += labelWidth;
      if (idx < contactItems.length - 1) {
        doc.text(contactSep, cursorX, y);
        cursorX += contactSepWidth;
      }
    });
    y += 4.6;
  }

  const validLinksATS = links.filter((l) => l.url.trim());
  if (validLinksATS.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const separator = '   |   ';
    const sepWidth = doc.getTextWidth(separator);
    let cursorX = marginX;
    validLinksATS.forEach((link, idx) => {
      const label = linkLabel(link);
      const labelWidth = doc.getTextWidth(label);
      if (cursorX + labelWidth > marginX + contentWidth && cursorX > marginX) {
        y += 4.6;
        cursorX = marginX;
      }
      doc.setTextColor(37, 99, 235);
      doc.textWithLink(label, cursorX, y, { url: normalizeLinkUrl(link.url) });
      cursorX += labelWidth;
      if (idx < validLinksATS.length - 1) {
        doc.setTextColor(90, 90, 90);
        doc.text(separator, cursorX, y);
        cursorX += sepWidth;
      }
    });
    y += 4.6;
  }

  y += 3;
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.5);
  doc.line(marginX, y, marginX + contentWidth, y);
  y += 8;

  if (personalInfo.summary) {
    sectionHeading('Professional Summary');
    wrappedText(personalInfo.summary);
    y += 4;
  }

  const validExperiences = experiences.filter((exp) => exp.company || exp.position);
  if (validExperiences.length > 0) {
    sectionHeading('Work Experience');
    validExperiences.forEach((exp) => {
      ensureSpace(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.position || 'Position', marginX, y);
      if (exp.startDate || exp.endDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        doc.text(`${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}`, marginX + contentWidth, y, { align: 'right' });
      }
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(exp.company || 'Company', marginX, y);
      y += 5;
      if (exp.description) renderDescription(exp.description, isBulleted('experience'), 9.5, 4.6);
      y += 4;
    });
  }

  const validEducations = educations.filter((edu) => edu.institution || edu.degree);
  if (validEducations.length > 0) {
    sectionHeading('Education');
    validEducations.forEach((edu) => {
      ensureSpace(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 20, 20);
      const degreeLine = [edu.degree, edu.field && `in ${edu.field}`].filter(Boolean).join(' ');
      doc.text(degreeLine || 'Degree', marginX, y);
      if (edu.startDate || edu.endDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        doc.text(`${edu.startDate || 'Start'} - ${edu.endDate || 'End'}`, marginX + contentWidth, y, { align: 'right' });
      }
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(edu.institution || 'Institution', marginX, y);
      y += 5;
      if (edu.gpa) {
        wrappedText(`GPA: ${edu.gpa}`, 9.5, 4.6);
      }
      y += 3;
    });
  }

  const validSkills = skills.filter((s) => s.name);
  if (validSkills.length > 0) {
    sectionHeading('Skills');
    if (isBulleted('skills')) {
      validSkills.forEach((s) => {
        ensureSpace(4.8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(45, 45, 45);
        doc.text('\u2022', marginX, y);
        doc.text(s.name, marginX + 4, y);
        y += 4.8;
      });
    } else {
      wrappedText(validSkills.map((s) => s.name).join('  \u2022  '), 10, 4.8);
    }
  }

  const validProjects = projects.filter((p) => p.name);
  if (validProjects.length > 0) {
    y += 4;
    sectionHeading('Projects');
    validProjects.forEach((proj) => {
      ensureSpace(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 20, 20);
      doc.text(proj.name, marginX, y);
      if (proj.link) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        doc.text(proj.link, marginX + contentWidth, y, { align: 'right' });
      }
      y += 5;
      if (proj.technologies) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        doc.text(proj.technologies, marginX, y);
        y += 5;
      }
      if (proj.description) renderDescription(proj.description, isBulleted('projects'), 9.5, 4.6);
      y += 4;
    });
  }

  const validCertifications = certifications.filter((c) => c.name);
  if (validCertifications.length > 0) {
    y += 2;
    sectionHeading('Certifications');
    validCertifications.forEach((cert) => {
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(cert.name, marginX, y);
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        doc.text(cert.date, marginX + contentWidth, y, { align: 'right' });
      }
      y += 4.6;
      if (cert.issuer) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        doc.text(cert.issuer, marginX, y);
        y += 4.6;
      }
      y += 2;
    });
  }

  const validLanguages = languages.filter((l) => l.name);
  if (validLanguages.length > 0) {
    y += 2;
    sectionHeading('Languages');
    if (isBulleted('languages')) {
      validLanguages.forEach((l) => {
        ensureSpace(4.8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(45, 45, 45);
        doc.text('\u2022', marginX, y);
        doc.text(l.proficiency ? `${l.name} (${l.proficiency})` : l.name, marginX + 4, y);
        y += 4.8;
      });
    } else {
      wrappedText(
        validLanguages.map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name)).join('  \u2022  '),
        10,
        4.8
      );
    }
  }

  doc.save(`${(filenameBase || 'Resume').replace(/\s/g, '_')}_ATS.pdf`);
}

export async function copyResumeToClipboard(args: ClipboardArgs): Promise<void> {
  const htmlContent = generateHTMLText(args);
  const plainContent = generatePlainText(args);

  try {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({
      'text/html': blob,
      'text/plain': new Blob([plainContent], { type: 'text/plain' }),
    });
    await navigator.clipboard.write([clipboardItem]);
  } catch {
    try {
      await navigator.clipboard.writeText(plainContent);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = plainContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Render a DOM node (the resume preview) down to a small JPEG snapshot,
 * used as the thumbnail shown on History cards. Cheaper and far more
 * reliable than trying to shrink a live re-render with CSS transforms.
 */
export async function captureResumeThumbnail(node: HTMLElement, maxWidth = 420, quality = 0.72): Promise<string> {
  const cloneElement = node.cloneNode(true) as HTMLElement;
  cloneElement.style.position = 'absolute';
  cloneElement.style.top = '-9999px';
  cloneElement.style.left = '-9999px';
  cloneElement.style.width = `${node.offsetWidth || 800}px`;
  cloneElement.style.backgroundColor = '#ffffff';

  document.body.appendChild(cloneElement);

  try {
    const fullCanvas = await html2canvas(cloneElement, {
      scale: 1,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    const scaleFactor = maxWidth / fullCanvas.width;
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = maxWidth;
    // cap the height so a very long resume doesn't produce a huge thumbnail;
    // the card only shows the top portion, which is what matters for recognition
    thumbCanvas.height = Math.min(Math.round(fullCanvas.height * scaleFactor), maxWidth * 1.6);

    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(
      fullCanvas,
      0, 0, fullCanvas.width, thumbCanvas.height / scaleFactor,
      0, 0, thumbCanvas.width, thumbCanvas.height
    );

    return thumbCanvas.toDataURL('image/jpeg', quality);
  } finally {
    document.body.removeChild(cloneElement);
  }
}

/**
 * Read an uploaded image file, downscale it, and resolve to a base64 JPEG
 * data URL. Keeps IndexedDB entries small since photos are stored inline.
 */
export function fileToCompressedBase64(file: File, maxDimension = 500, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

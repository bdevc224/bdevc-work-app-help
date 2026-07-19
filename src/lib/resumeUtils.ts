// FILE: src/lib/resumeUtils.ts

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { PersonalInfo, Experience, Education, Skill } from '../types/resume';

/** Render a DOM node (the resume preview) to a downloadable PDF. */
export async function exportNodeToPDF(node: HTMLElement, filenameBase: string) {
  const cloneElement = node.cloneNode(true) as HTMLElement;
  cloneElement.style.position = 'absolute';
  cloneElement.style.top = '-9999px';
  cloneElement.style.left = '-9999px';
  cloneElement.style.width = `${node.offsetWidth || 800}px`;
  cloneElement.style.backgroundColor = '#ffffff';

  document.body.appendChild(cloneElement);

  try {
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

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 15, position + 10, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 15, position + 10, imgWidth, imgHeight);
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
}

function generateHTMLText({ personalInfo, experiences, educations, skills }: ClipboardArgs): string {
  const sections: string[] = [];
  sections.push(`<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">`);
  sections.push(`<div style="text-align: center; margin-bottom: 20px;">`);
  sections.push(`<h1 style="color: #1e40af; margin-bottom: 5px;">${personalInfo.fullName || 'NAME'}</h1>`);
  sections.push(`<h2 style="color: #3b82f6; font-size: 18px; margin-top: 0;">${personalInfo.jobTitle || 'JOB TITLE'}</h2>`);
  sections.push(`<div style="color: #4b5563; font-size: 12px; margin-top: 10px;">`);
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(personalInfo.email);
  if (personalInfo.phone) contacts.push(personalInfo.phone);
  if (personalInfo.location) contacts.push(personalInfo.location);
  sections.push(contacts.join(' | '));
  sections.push(`</div></div>`);

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
      if (exp.description) sections.push(`<p style="color: #374151; margin-top: 8px;">${exp.description}</p>`);
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
    sections.push(`<div style="margin-bottom: 20px;"><h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">SKILLS</h3><div style="display: flex; flex-wrap: wrap; gap: 8px;">`);
    validSkills.forEach((skill) => {
      sections.push(`<span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${skill.name}</span>`);
    });
    sections.push(`</div></div>`);
  }

  sections.push(`</div>`);
  return sections.join('');
}

function generatePlainText({ personalInfo, experiences, educations, skills }: ClipboardArgs): string {
  const lines: string[] = [];
  lines.push(personalInfo.fullName || 'NAME');
  lines.push(personalInfo.jobTitle || 'JOB TITLE');
  lines.push('');

  const contactInfo: string[] = [];
  if (personalInfo.email) contactInfo.push(`Email: ${personalInfo.email}`);
  if (personalInfo.phone) contactInfo.push(`Phone: ${personalInfo.phone}`);
  if (personalInfo.location) contactInfo.push(`Location: ${personalInfo.location}`);
  if (contactInfo.length > 0) lines.push(contactInfo.join('  |  '));
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
      if (exp.description) lines.push(exp.description);
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
    lines.push(validSkills.map((s) => s.name).join(', '));
  }

  return lines.join('\n');
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

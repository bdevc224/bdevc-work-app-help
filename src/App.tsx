import React, { useState, useRef, useCallback } from 'react';
import { Download, Copy, FileText, Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Types
interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

const App: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'BDevC',
    jobTitle: 'Frontend Developer',
    email: 'bdevc224@gmail.com',
    phone: '+916 622 6690',
    location: 'Lagos, Nigeria',
    website: 'https://bdevc-portfolio-website.netlify.app/',
    linkedin: 'www.linkedin.com/in/b-dev-c-585a34307',
    github: 'https://github.com/bdevc224',
    summary: 'Results-driven Web Developer with 6+ years of experience building responsive web applications. Passionate about creating intuitive user interfaces and optimizing performance. Strong background in React, TypeScript, and modern CSS frameworks.',
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 'exp1',
      company: 'TechCorp Inc.',
      position: 'Senior Frontend Developer',
      startDate: '2022-01',
      endDate: 'Present',
      description: 'Lead the development of a component library used across 5+ products. Improved application performance by 40% through code splitting and lazy loading. Mentored 3 junior developers.',
    },
    {
      id: 'exp2',
      company: 'WebStudio Agency',
      position: 'Frontend Developer',
      startDate: '2019-03',
      endDate: '2021-12',
      description: 'Built responsive websites for 20+ clients using React and Vue.js. Collaborated with designers to implement pixel-perfect interfaces. Reduced load time by 35% through optimization.',
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: 'edu1',
      institution: 'Enugu State University of Science and Technology',
      degree: 'Bachelor of Engineering',
      field: 'Civil Engineering',
      startDate: '2020-03',
      endDate: '2025-07',
      gpa: '3.8',
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: 'skill1', name: 'React', level: 5 },
    { id: 'skill2', name: 'TypeScript', level: 4 },
    { id: 'skill3', name: 'Tailwind CSS', level: 5 },
    { id: 'skill4', name: 'Node.js', level: 3 },
  ]);

  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setExperiences(prev => [...prev, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setEducations(prev => [...prev, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(prev =>
      prev.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: string) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3,
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(prev =>
      prev.map(skill => (skill.id === id ? { ...skill, [field]: value } : skill))
    );
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  // Fixed PDF Download - using a clone element to avoid canvas issues
  const downloadPDF = async () => {
    if (!resumeRef.current) {
      console.error('Resume element not found');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Created a clone of the resume element to avoid affecting the displayed version
      const originalElement = resumeRef.current;
      const cloneElement = originalElement.cloneNode(true) as HTMLElement;
      
      // Applied inline styles to the clone to ensure consistent rendering
      cloneElement.style.position = 'absolute';
      cloneElement.style.top = '-9999px';
      cloneElement.style.left = '-9999px';
      cloneElement.style.width = '800px';
      cloneElement.style.backgroundColor = '#ffffff';
      
      // Replaced gradient backgrounds with solid colors for better compatibility
      const headerDiv = cloneElement.querySelector('.resume-header');
      if (headerDiv) {
        (headerDiv as HTMLElement).style.background = '#1e40af';
        (headerDiv as HTMLElement).style.backgroundColor = '#1e40af';
      }
      
      document.body.appendChild(cloneElement);
      
      // Use html2canvas on the clone
      const canvas = await html2canvas(cloneElement, {
        scale: 2.5,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
      });
      
      // Remove the clone
      document.body.removeChild(cloneElement);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      });

      const imgWidth = 180;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 15, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 15, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${personalInfo.fullName.replace(/\s/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again or use the Copy Text feature.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Enhanced copy to clipboard with rich text formatting for Word
  const copyToClipboard = useCallback(async () => {
    if (!resumeRef.current) return;

    // Create HTML formatted content for better Word compatibility
    const generateHTMLText = (): string => {
      const sections: string[] = [];
      
      // Header
      sections.push(`<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">`);
      sections.push(`<div style="text-align: center; margin-bottom: 20px;">`);
      sections.push(`<h1 style="color: #1e40af; margin-bottom: 5px;">${personalInfo.fullName || 'NAME'}</h1>`);
      sections.push(`<h2 style="color: #3b82f6; font-size: 18px; margin-top: 0;">${personalInfo.jobTitle || 'JOB TITLE'}</h2>`);
      sections.push(`<div style="color: #4b5563; font-size: 12px; margin-top: 10px;">`);
      
      const contacts = [];
      if (personalInfo.email) contacts.push(`${personalInfo.email}`);
      if (personalInfo.phone) contacts.push(`${personalInfo.phone}`);
      if (personalInfo.location) contacts.push(`${personalInfo.location}`);
      sections.push(contacts.join(' | '));
      sections.push(`</div>`);
      sections.push(`</div>`);
      
      // Summary
      if (personalInfo.summary) {
        sections.push(`<div style="margin-bottom: 20px;">`);
        sections.push(`<h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h3>`);
        sections.push(`<p style="color: #374151; line-height: 1.5;">${personalInfo.summary}</p>`);
        sections.push(`</div>`);
      }
      
      // Work Experience
      const validExperiences = experiences.filter(exp => exp.company || exp.position);
      if (validExperiences.length > 0) {
        sections.push(`<div style="margin-bottom: 20px;">`);
        sections.push(`<h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">WORK EXPERIENCE</h3>`);
        validExperiences.forEach(exp => {
          sections.push(`<div style="margin-bottom: 15px;">`);
          sections.push(`<div style="display: flex; justify-content: space-between; flex-wrap: wrap;">`);
          sections.push(`<div>`);
          sections.push(`<strong style="color: #1f2937;">${exp.position || 'Position'}</strong><br>`);
          sections.push(`<span style="color: #3b82f6;">${exp.company || 'Company'}</span>`);
          sections.push(`</div>`);
          if (exp.startDate || exp.endDate) {
            sections.push(`<span style="color: #6b7280;">${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}</span>`);
          }
          sections.push(`</div>`);
          if (exp.description) {
            sections.push(`<p style="color: #374151; margin-top: 8px;">${exp.description}</p>`);
          }
          sections.push(`</div>`);
        });
        sections.push(`</div>`);
      }
      
      // Education
      const validEducations = educations.filter(edu => edu.institution || edu.degree);
      if (validEducations.length > 0) {
        sections.push(`<div style="margin-bottom: 20px;">`);
        sections.push(`<h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">EDUCATION</h3>`);
        validEducations.forEach(edu => {
          sections.push(`<div style="margin-bottom: 15px;">`);
          sections.push(`<div style="display: flex; justify-content: space-between; flex-wrap: wrap;">`);
          sections.push(`<div>`);
          sections.push(`<strong style="color: #1f2937;">${edu.institution || 'Institution'}</strong><br>`);
          sections.push(`<span>${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}</span>`);
          sections.push(`</div>`);
          if (edu.startDate || edu.endDate) {
            sections.push(`<span style="color: #6b7280;">${edu.startDate || 'Start'} - ${edu.endDate || 'End'}</span>`);
          }
          sections.push(`</div>`);
          if (edu.gpa) {
            sections.push(`<p style="color: #6b7280; margin-top: 5px;">GPA: ${edu.gpa}</p>`);
          }
          sections.push(`</div>`);
        });
        sections.push(`</div>`);
      }
      
      // Skills
      const validSkills = skills.filter(skill => skill.name);
      if (validSkills.length > 0) {
        sections.push(`<div style="margin-bottom: 20px;">`);
        sections.push(`<h3 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">SKILLS</h3>`);
        sections.push(`<div style="display: flex; flex-wrap: wrap; gap: 8px;">`);
        validSkills.forEach(skill => {
          sections.push(`<span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${skill.name}${skill.level > 0 ? ` (${'★'.repeat(skill.level)})` : ''}</span>`);
        });
        sections.push(`</div>`);
        sections.push(`</div>`);
      }
      
      sections.push(`</div>`);
      return sections.join('');
    };

    const generatePlainText = (): string => {
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
        lines.push('PROFESSIONAL SUMMARY');
        lines.push('-'.repeat(50));
        lines.push(personalInfo.summary);
        lines.push('');
      }
      
      const validExperiences = experiences.filter(exp => exp.company || exp.position);
      if (validExperiences.length > 0) {
        lines.push('WORK EXPERIENCE');
        lines.push('-'.repeat(50));
        validExperiences.forEach(exp => {
          lines.push(`${exp.position || 'Position'} at ${exp.company || 'Company'}`);
          if (exp.startDate || exp.endDate) lines.push(`${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}`);
          if (exp.description) lines.push(exp.description);
          lines.push('');
        });
      }
      
      const validEducations = educations.filter(edu => edu.institution || edu.degree);
      if (validEducations.length > 0) {
        lines.push('EDUCATION');
        lines.push('-'.repeat(50));
        validEducations.forEach(edu => {
          lines.push(`${edu.degree || 'Degree'} in ${edu.field || 'Field'}`);
          lines.push(edu.institution || 'Institution');
          if (edu.startDate || edu.endDate) lines.push(`${edu.startDate || 'Start'} - ${edu.endDate || 'End'}`);
          if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
          lines.push('');
        });
      }
      
      const validSkills = skills.filter(skill => skill.name);
      if (validSkills.length > 0) {
        lines.push('SKILLS');
        lines.push('-'.repeat(50));
        const skillStrings = validSkills.map(skill => `${skill.name}${skill.level > 0 ? ' (' + '★'.repeat(skill.level) + ')' : ''}`);
        lines.push(skillStrings.join(', '));
      }
      
      return lines.join('\n');
    };

    try {
      // Try to copy HTML for rich formatting in Word
      const htmlContent = generateHTMLText();
      const plainContent = generatePlainText();
      
      // Attempt to copy rich text (HTML)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([plainContent], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      alert('✓ Resume copied to clipboard!\n\nPaste into Word or Google Docs for formatted version, or paste as plain text.');
    } catch (err) {
      // Fallback to plain text only
      const plainContent = generatePlainText();
      try {
        await navigator.clipboard.writeText(plainContent);
        alert('✓ Resume copied to clipboard as text!');
      } catch (fallbackErr) {
        // Final fallback for very old browsers
        const textarea = document.createElement('textarea');
        textarea.value = plainContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✓ Resume copied to clipboard!');
      }
    }
  }, [personalInfo, experiences, educations, skills]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">BDev.C's Resume Builder</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Text
              </button>
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  isGeneratingPDF 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="lg:w-2/5 xl:w-1/3">
            <div className="bg-white rounded-lg shadow-md sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="flex border-b border-gray-200">
                {['personal', 'experience', 'education', 'skills'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                      activeSection === section
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={personalInfo.jobTitle}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={personalInfo.location}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="text"
                        name="website"
                        value={personalInfo.website}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={personalInfo.linkedin}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                      <input
                        type="text"
                        name="github"
                        value={personalInfo.github}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                      <textarea
                        name="summary"
                        value={personalInfo.summary}
                        onChange={handlePersonalChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="month"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addExperience}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    {educations.map((edu) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="month"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="month"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addEducation}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-6">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(level => (
                            <button
                              key={level}
                              onClick={() => updateSkill(skill.id, 'level', level)}
                              className={`text-lg ${skill.level >= level ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addSkill}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:w-3/5 xl:w-2/3">
            <div className="bg-gray-50 rounded-lg p-4 shadow-md">
              <div className="max-w-4xl mx-auto">
                <div ref={resumeRef} className="bg-white shadow-xl rounded-lg overflow-hidden">
                  {/* Resume Header - Using solid colors instead of gradients for PDF compatibility */}
                  <div className="resume-header" style={{ backgroundColor: '#1e40af', color: 'white', padding: '32px 24px' }}>
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
                        {personalInfo.linkedin && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{personalInfo.linkedin}</span>
                          </div>
                        )}
                        {personalInfo.github && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{personalInfo.github}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '24px'}}>
                    {/* Summary */}
                    {personalInfo.summary && (
                      <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
                          Professional Summary
                        </h2>
                        <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{personalInfo.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {experiences.filter(exp => exp.company || exp.position).length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Briefcase style={{ width: '16px', height: '16px' }} />
                          Work Experience
                        </h2>
                        <div style={{ }}>
                          {experiences.map((exp) => (
                            (exp.company || exp.position) && (
                              <div key={exp.id} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <h3 style={{ fontWeight: 'semibold', color: '#1f2937', margin: 0 }}>{exp.position || 'Position'}</h3>
                                    <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: 'medium', margin: 0 }}>{exp.company || 'Company'}</p>
                                  </div>
                                  {(exp.startDate || exp.endDate) && (
                                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                      {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                                    </p>
                                  )}
                                </div>
                                {exp.description && (
                                  <p style={{ color: '#4b5563', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>{exp.description}</p>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {educations.filter(edu => edu.institution || edu.degree).length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <GraduationCap style={{ width: '16px', height: '16px' }} />
                          Education
                        </h2>
                        <div>
                          {educations.map((edu) => (
                            (edu.institution || edu.degree) && (
                              <div key={edu.id} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <h3 style={{ fontWeight: 'semibold', color: '#1f2937', margin: 0 }}>{edu.institution || 'Institution'}</h3>
                                    <p style={{ color: '#374151', fontSize: '14px', margin: 0 }}>
                                      {edu.degree && edu.degree} {edu.field && `in ${edu.field}`}
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
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {skills.filter(s => s.name).length > 0 && (
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', marginBottom: '12px' }}>
                          Skills
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {skills.map((skill) => (
                            skill.name && (
                              <div key={skill.id} style={{ backgroundColor: '#f3f4f6', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', color: '#374151' }}>
                                {skill.name} {skill.level > 0 && `(${'★'.repeat(skill.level)})`}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
// FILE: src/Pages/ResumeBuilder.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download, Copy, FileText, Plus, Trash2, Palette, Save, History as HistoryIcon, Check, Settings, ChevronDown, Type,
} from 'lucide-react';

import ImageUpload from '../components/ImageUpload';
import TemplateSelector from '../components/TemplateSelector';
import SaveSettings from '../components/SaveSettings';
import DownloadMenu from '../components/DownloadMenu';
import FormattingSettings from '../components/FormattingSettings';
import ResumeRenderer from '../templates';
import { TEMPLATES, LINK_PLATFORMS } from '../types/resume';
import type {
  PersonalInfo, Experience, Education, Skill, Project, Certification, LanguageItem, SocialLink, LinkPlatform, FormattingOptions, TemplateId, SavedResume, ResumeContent,
} from '../types/resume';
import { emptyPersonalInfo, normalizeResumeContent, defaultFormattingOptions } from '../types/resume';
import { getResume, createResume, updateResume } from '../lib/db';
import { exportNodeToPDF, exportATSFriendlyPDF, copyResumeToClipboard, captureResumeThumbnail } from '../lib/resumeUtils';

const AUTOSAVE_STORAGE_KEY = 'resume-builder:autosave';
const AUTOSAVE_DEBOUNCE_MS = 1800;
const THUMBNAIL_REFRESH_MS = 60000; // during autosave, refresh the thumbnail at most once a minute

function readAutoSavePreference(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(AUTOSAVE_STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

function hasMeaningfulContent(
  personalInfo: PersonalInfo,
  experiences: Experience[],
  educations: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Certification[],
  languages: LanguageItem[],
  links: SocialLink[]
): boolean {
  return Boolean(
    personalInfo.fullName.trim() ||
    personalInfo.jobTitle.trim() ||
    experiences.length > 0 ||
    educations.length > 0 ||
    skills.length > 0 ||
    projects.length > 0 ||
    certifications.length > 0 ||
    languages.length > 0 ||
    links.length > 0
  );
}

function ResumeBuilder() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [resumeId, setResumeId] = useState<string | undefined>(id);
  const [title, setTitle] = useState('Untitled Resume');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...emptyPersonalInfo });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [formatting, setFormatting] = useState<FormattingOptions>({
    ...defaultFormattingOptions,
    sections: { ...defaultFormattingOptions.sections },
  });

  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showSaveSettings, setShowSaveSettings] = useState(false);
  const [showFormattingSettings, setShowFormattingSettings] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'saved'>('idle');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(readAutoSavePreference);
  const [loading, setLoading] = useState(!!id);

  const resumeRef = useRef<HTMLDivElement>(null);
  const isSavingRef = useRef(false);
  const isDirtyRef = useRef(false);
  const lastThumbnailAtRef = useRef(0);
  const skipDirtyOnceRef = useRef(false);

  // Persist the autosave preference across sessions
  useEffect(() => {
    window.localStorage.setItem(AUTOSAVE_STORAGE_KEY, String(autoSaveEnabled));
  }, [autoSaveEnabled]);

  // Load an existing saved resume when arriving with an :id
  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getResume(id).then((record) => {
      if (cancelled) return;
      if (record) {
        const normalized = normalizeResumeContent(record);
        skipDirtyOnceRef.current = true;
        setResumeId(record.id);
        setTitle(record.title);
        setPersonalInfo(normalized.personalInfo);
        setExperiences(normalized.experiences);
        setEducations(normalized.educations);
        setSkills(normalized.skills);
        setProjects(normalized.projects);
        setCertifications(normalized.certifications);
        setLanguages(normalized.languages);
        setLinks(normalized.links);
        setTemplateId(normalized.templateId);
        setFormatting(normalized.formatting);
      } else {
        // Unknown id - treat as a fresh resume
        navigate('/resumebuilder', { replace: true });
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' },
    ]);
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };
  const removeExperience = (id: string) => setExperiences((prev) => prev.filter((exp) => exp.id !== id));

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      { id: Date.now().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
    ]);
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };
  const removeEducation = (id: string) => setEducations((prev) => prev.filter((edu) => edu.id !== id));

  const addSkill = () => setSkills((prev) => [...prev, { id: Date.now().toString(), name: '' }]);
  const updateSkill = (id: string, value: string) => {
    setSkills((prev) => prev.map((skill) => (skill.id === id ? { ...skill, name: value } : skill)));
  };
  const removeSkill = (id: string) => setSkills((prev) => prev.filter((skill) => skill.id !== id));

  const addProject = () => {
    setProjects((prev) => [...prev, { id: Date.now().toString(), name: '', description: '', technologies: '', link: '' }]);
  };
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)));
  };
  const removeProject = (id: string) => setProjects((prev) => prev.filter((proj) => proj.id !== id));

  const addCertification = () => {
    setCertifications((prev) => [...prev, { id: Date.now().toString(), name: '', issuer: '', date: '' }]);
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications((prev) => prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)));
  };
  const removeCertification = (id: string) => setCertifications((prev) => prev.filter((cert) => cert.id !== id));

  const addLanguage = () => {
    setLanguages((prev) => [...prev, { id: Date.now().toString(), name: '', proficiency: '' }]);
  };
  const updateLanguage = (id: string, field: keyof LanguageItem, value: string) => {
    setLanguages((prev) => prev.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)));
  };
  const removeLanguage = (id: string) => setLanguages((prev) => prev.filter((lang) => lang.id !== id));

  const addLink = () => {
    setLinks((prev) => [...prev, { id: Date.now().toString(), platform: 'linkedin' as LinkPlatform, url: '', customLabel: '' }]);
  };
  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };
  const removeLink = (id: string) => setLinks((prev) => prev.filter((link) => link.id !== id));

  // Mark the resume dirty whenever meaningful data changes - but not on the
  // initial load of an existing resume, which also touches all this state.
  useEffect(() => {
    if (loading) return;
    if (skipDirtyOnceRef.current) {
      skipDirtyOnceRef.current = false;
      return;
    }
    isDirtyRef.current = true;
    setAutoSaveStatus((prev) => (prev === 'saving' ? prev : 'pending'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, links, templateId, formatting, title, loading]);

  // Warn before leaving the page if there are unsaved changes and autosave is off
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!autoSaveEnabled && isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [autoSaveEnabled]);

  const saveNow = useCallback(
    async (silent: boolean) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      if (!silent) setSaveState('saving');
      setAutoSaveStatus('saving');

      try {
        const effectiveTitle = title.trim() || personalInfo.fullName || 'Untitled Resume';
        const content: ResumeContent = { personalInfo, experiences, educations, skills, projects, certifications, languages, links, templateId, formatting };

        // Manual saves always refresh the thumbnail; autosaves refresh it at
        // most once a minute so typing doesn't trigger constant canvas renders.
        const now = Date.now();
        const shouldCaptureThumbnail = !silent || now - lastThumbnailAtRef.current > THUMBNAIL_REFRESH_MS;
        let thumbnail: string | undefined;
        if (shouldCaptureThumbnail && resumeRef.current) {
          try {
            thumbnail = await captureResumeThumbnail(resumeRef.current);
            lastThumbnailAtRef.current = now;
          } catch (error) {
            console.error('Thumbnail capture failed:', error);
          }
        }

        let record: SavedResume;
        if (resumeId) {
          record = await updateResume(resumeId, content, effectiveTitle, thumbnail);
        } else {
          record = await createResume(content, effectiveTitle, thumbnail);
          setResumeId(record.id);
          navigate(`/resumebuilder/${record.id}`, { replace: true });
        }

        setTitle(record.title);
        isDirtyRef.current = false;
        setAutoSaveStatus('saved');
        if (!silent) setSaveState('saved');
        setTimeout(() => {
          setAutoSaveStatus('idle');
          if (!silent) setSaveState('idle');
        }, 1600);
      } finally {
        isSavingRef.current = false;
      }
    },
    [title, personalInfo, experiences, educations, skills, projects, certifications, languages, links, templateId, formatting, resumeId, navigate]
  );

  // Debounced autosave - fires a couple of seconds after the last change
  useEffect(() => {
    if (loading || !autoSaveEnabled) return;
    if (!hasMeaningfulContent(personalInfo, experiences, educations, skills, projects, certifications, languages, links)) return;
    if (!isDirtyRef.current) return;

    const timer = setTimeout(() => {
      saveNow(true);
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, links, templateId, formatting, title, autoSaveEnabled, loading]);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await exportNodeToPDF(resumeRef.current, `${personalInfo.fullName || 'Resume'}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again or use the Copy Text feature.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadATSPDF = () => {
    try {
      exportATSFriendlyPDF({ personalInfo, experiences, educations, skills, projects, certifications, languages, links, formatting }, personalInfo.fullName || 'Resume');
    } catch (error) {
      console.error('ATS PDF generation error:', error);
      alert('Failed to generate the ATS-friendly PDF. Please try again.');
    }
  };

  const copyToClipboard = useCallback(async () => {
    try {
      await copyResumeToClipboard({ personalInfo, experiences, educations, skills, projects, certifications, languages, links, formatting });
      alert('✓ Resume copied to clipboard!\n\nPaste into Word or Google Docs for formatted version, or paste as plain text.');
    } catch {
      alert('Could not copy to clipboard in this browser.');
    }
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, links, formatting]);

  const currentTemplateMeta = TEMPLATES.find((t) => t.id === templateId);

  const autoSaveStatusLabel = (() => {
    if (!autoSaveEnabled) return 'Auto-save off';
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving\u2026';
      case 'pending':
        return 'Unsaved changes';
      case 'saved':
        return 'Saved';
      default:
        return resumeId ? 'All changes saved' : '';
    }
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="w-6 h-6 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1 max-w-xs">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Resume"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 w-full"
                />
                {autoSaveStatusLabel && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 px-1 -mt-0.5">{autoSaveStatusLabel}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </button>
              <button
                onClick={() => setShowTemplatePicker(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Palette className="w-4 h-4" />
                {currentTemplateMeta?.name || 'Template'}
              </button>
              <button
                onClick={() => setShowFormattingSettings((v) => !v)}
                title="Bullets & bold"
                aria-label="Bullets and bold formatting settings"
                className="relative flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Type className="w-4 h-4" />
                {formatting.enabled && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </button>
              <button
                onClick={() => setShowSaveSettings((v) => !v)}
                title="Save settings"
                aria-label="Save settings"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => saveNow(false)}
                disabled={saveState === 'saving'}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {saveState === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Text
              </button>
              <button
                onClick={() => setShowDownloadMenu((v) => !v)}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  isGeneratingPDF ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="lg:w-2/5 xl:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto transition-colors duration-300">
              <div className="flex flex-wrap gap-1.5 p-3 border-b border-gray-200 dark:border-gray-700">
                {[
                  { id: 'personal', label: 'Personal' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'education', label: 'Education' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'certifications', label: 'Certifications' },
                  { id: 'languages', label: 'Languages' },
                  { id: 'links', label: 'Links' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <ImageUpload
                      photo={personalInfo.photo}
                      onChange={(photo) => setPersonalInfo((prev) => ({ ...prev, photo }))}
                    />
                    {!currentTemplateMeta?.supportsPhoto && personalInfo.photo && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        The "{currentTemplateMeta?.name}" template doesn't display a photo. Switch templates to show it.
                      </p>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input type="text" name="fullName" value={personalInfo.fullName} onChange={handlePersonalChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                      <input type="text" name="jobTitle" value={personalInfo.jobTitle} onChange={handlePersonalChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input type="text" name="location" value={personalInfo.location} onChange={handlePersonalChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Summary</label>
                      <textarea name="summary" value={personalInfo.summary} onChange={handlePersonalChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                        <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Position" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="month" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                          <input type="text" placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        </div>
                        <textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        {formatting.enabled && formatting.sections.experience && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">
                            Bullets on: one line = one bullet. Use **text** to bold a word or phrase.
                          </p>
                        )}
                      </div>
                    ))}
                    <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </button>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    {educations.map((edu) => (
                      <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                        <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Field of Study" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="month" placeholder="Start Date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                          <input type="month" placeholder="End Date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        </div>
                        <input type="text" placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                      </div>
                    ))}
                    <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-3">
                        <input type="text" placeholder="Skill name" value={skill.name} onChange={(e) => updateSkill(skill.id, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <button onClick={() => removeSkill(skill.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addSkill} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div className="space-y-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                      Great for showing proof of work — portfolio pieces, side projects, open-source contributions, or notable initiatives at work.
                    </p>
                    {projects.map((proj) => (
                      <div key={proj.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                        <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input type="text" placeholder="Project name" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Technologies used (e.g. React, Node.js, PostgreSQL)" value={proj.technologies} onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Link (optional - live URL, repo, case study)" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <textarea placeholder="Description" value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        {formatting.enabled && formatting.sections.projects && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">
                            Bullets on: one line = one bullet. Use **text** to bold a word or phrase.
                          </p>
                        )}
                      </div>
                    ))}
                    <button onClick={addProject} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div className="space-y-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                      Professional certifications, licenses, or credentials — cloud platforms, project management, industry-specific licenses, etc.
                    </p>
                    {certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                        <button onClick={() => removeCertification(cert.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input type="text" placeholder="Certification name" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Issuing organization" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <input type="text" placeholder="Date issued (e.g. 2024-06)" value={cert.date} onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                      </div>
                    ))}
                    <button onClick={addCertification} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>
                )}

                {activeSection === 'languages' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                      Especially useful when applying internationally — list each language and your proficiency level.
                    </p>
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center gap-2">
                        <input type="text" placeholder="Language (e.g. Spanish)" value={lang.name} onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md" />
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                        >
                          <option value="">Proficiency</option>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Basic">Basic</option>
                        </select>
                        <button onClick={() => removeLanguage(lang.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addLanguage} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Language
                    </button>
                  </div>
                )}

                {activeSection === 'links' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                      Pick a platform and paste the URL. Your resume shows just the platform name (e.g. "LinkedIn"),
                      not the raw link — but it's still a real clickable link wherever you view or download it.
                    </p>
                    {links.map((link) => (
                      <div key={link.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                        <button onClick={() => removeLink(link.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <select
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, 'platform', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                        >
                          {LINK_PLATFORMS.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                        {link.platform === 'other' && (
                          <input
                            type="text"
                            placeholder="Label to show on your resume (e.g. Blog)"
                            value={link.customLabel}
                            onChange={(e) => updateLink(link.id, 'customLabel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                          />
                        )}
                        <input
                          type="text"
                          placeholder="URL (e.g. linkedin.com/in/yourname)"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                        />
                      </div>
                    ))}
                    <button onClick={addLink} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section - intentionally NOT dark-mode themed: this is the
              actual resume artifact that gets exported/printed, so it always
              renders as its template designed it (usually white). */}
          <div className="lg:w-3/5 xl:w-2/3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-md transition-colors duration-300">
              <div className="max-w-4xl mx-auto">
                <ResumeRenderer
                  ref={resumeRef}
                  templateId={templateId}
                  personalInfo={personalInfo}
                  experiences={experiences}
                  educations={educations}
                  skills={skills}
                  projects={projects}
                  certifications={certifications}
                  languages={languages}
                  links={links}
                  formatting={formatting}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {showTemplatePicker && (
        <TemplateSelector
          selected={templateId}
          onSelect={setTemplateId}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {showSaveSettings && (
        <SaveSettings
          autoSaveEnabled={autoSaveEnabled}
          onToggle={setAutoSaveEnabled}
          onClose={() => setShowSaveSettings(false)}
        />
      )}

      {showFormattingSettings && (
        <FormattingSettings
          formatting={formatting}
          onChange={setFormatting}
          onClose={() => setShowFormattingSettings(false)}
        />
      )}

      {showDownloadMenu && (
        <DownloadMenu
          onDownloadVisual={downloadPDF}
          onDownloadATS={downloadATSPDF}
          isGenerating={isGeneratingPDF}
          onClose={() => setShowDownloadMenu(false)}
        />
      )}
    </div>
  );
}

export default ResumeBuilder;

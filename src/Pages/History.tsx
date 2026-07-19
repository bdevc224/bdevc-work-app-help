// FILE: src/Pages/History.tsx

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Download, Pencil, Trash2, Plus, FileText, Clock } from 'lucide-react';
import { listResumes, duplicateResume, deleteResume } from '../lib/db';
import { TEMPLATES } from '../types/resume';
import type { SavedResume } from '../types/resume';
import ResumeRenderer from '../templates';
import { exportNodeToPDF } from '../lib/resumeUtils';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function History() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  // Off-screen render target used to generate a PDF for a resume that isn't open in the builder
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [pdfTarget, setPdfTarget] = useState<SavedResume | null>(null);

  const refresh = async () => {
    setLoading(true);
    const all = await listResumes();
    setResumes(all);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDuplicate = async (id: string) => {
    await duplicateResume(id);
    refresh();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deleteResume(id);
    refresh();
  };

  const handleDownload = (resume: SavedResume) => {
    setPdfTarget(resume);
    setDownloadingId(resume.id);
  };

  // Once pdfTarget is rendered off-screen, capture it to PDF
  useEffect(() => {
    if (!pdfTarget || !hiddenRef.current) return;
    const node = hiddenRef.current;
    const run = async () => {
      try {
        await exportNodeToPDF(node, pdfTarget.personalInfo.fullName || pdfTarget.title);
      } catch (e) {
        console.error(e);
        alert('Failed to generate PDF for this resume.');
      } finally {
        setDownloadingId(null);
        setPdfTarget(null);
      }
    };
    // give the DOM a tick to paint
    const t = setTimeout(run, 50);
    return () => clearTimeout(t);
  }, [pdfTarget]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Resume History</h1>
          </div>
          <button
            onClick={() => navigate('/resumebuilder')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Resume
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : resumes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors duration-300">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">No saved resumes yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Build a resume and hit Save to see it here.</p>
            <button
              onClick={() => navigate('/resumebuilder')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const templateName = TEMPLATES.find((t) => t.id === resume.templateId)?.name || resume.templateId;
              return (
                <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-colors duration-300">
                  <button
                    onClick={() => navigate(`/resumebuilder/${resume.id}`)}
                    className="h-40 w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 relative group overflow-hidden"
                  >
                    {resume.thumbnail ? (
                      <img
                        src={resume.thumbnail}
                        alt={`${resume.title} preview`}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300 dark:text-gray-600">
                        <FileText className="w-8 h-8" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">No preview yet</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </span>
                    </div>
                  </button>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{resume.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{templateName} template &middot; Updated {formatDate(resume.updatedAt)}</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/resumebuilder/${resume.id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(resume.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button
                        onClick={() => handleDownload(resume)}
                        disabled={downloadingId === resume.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" /> {downloadingId === resume.id ? '...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id, resume.title)}
                        className="flex items-center justify-center px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Off-screen renderer used to generate a PDF without opening the builder */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '800px' }}>
        {pdfTarget && (
          <ResumeRenderer
            ref={hiddenRef}
            templateId={pdfTarget.templateId}
            personalInfo={pdfTarget.personalInfo}
            experiences={pdfTarget.experiences}
            educations={pdfTarget.educations}
            skills={pdfTarget.skills}
          />
        )}
      </div>
    </div>
  );
}

export default History;

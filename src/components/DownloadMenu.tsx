// FILE: src/components/DownloadMenu.tsx

import React from 'react';
import { FileImage, FileCheck2 } from 'lucide-react';

interface DownloadMenuProps {
  onDownloadVisual: () => void;
  onDownloadATS: () => void;
  isGenerating: boolean;
  onClose: () => void;
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({ onDownloadVisual, onDownloadATS, isGenerating, onClose }) => {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute right-4 sm:right-8 top-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onDownloadVisual();
            onClose();
          }}
          disabled={isGenerating}
          className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50"
        >
          <FileImage className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">Visual PDF</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              Matches your chosen template exactly. Best for emailing directly to a person or printing.
            </span>
          </span>
        </button>

        <button
          onClick={() => {
            onDownloadATS();
            onClose();
          }}
          className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">ATS-Friendly PDF</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              Plain single-column layout with real, selectable text (no template styling). Use this when
              uploading to a job application portal so applicant tracking software can read it correctly.
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default DownloadMenu;

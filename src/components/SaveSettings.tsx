// FILE: src/components/SaveSettings.tsx

import React from 'react';

interface SaveSettingsProps {
  autoSaveEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onClose: () => void;
}

const SaveSettings: React.FC<SaveSettingsProps> = ({ autoSaveEnabled, onToggle, onClose }) => {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute right-4 sm:right-8 top-16 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Save settings</h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="mt-1 w-4 h-4 accent-blue-600 shrink-0"
          />
          <span>
            <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">Auto-save</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              Saves your changes a couple of seconds after you stop typing. Turn this off to save only
              when you press the Save button — we'll warn you before leaving the page if you have
              unsaved changes.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default SaveSettings;

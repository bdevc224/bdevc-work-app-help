// FILE: src/components/FormattingSettings.tsx

import React from 'react';
import type { FormattingOptions } from '../types/resume';

interface FormattingSettingsProps {
  formatting: FormattingOptions;
  onChange: (formatting: FormattingOptions) => void;
  onClose: () => void;
}

const SECTION_LABELS: { id: keyof FormattingOptions['sections']; label: string }[] = [
  { id: 'experience', label: 'Experience descriptions' },
  { id: 'projects', label: 'Project descriptions' },
  { id: 'skills', label: 'Skills' },
  { id: 'languages', label: 'Languages' },
];

const FormattingSettings: React.FC<FormattingSettingsProps> = ({ formatting, onChange, onClose }) => {
  const allChecked = SECTION_LABELS.every((s) => formatting.sections[s.id]);
  const noneChecked = SECTION_LABELS.every((s) => !formatting.sections[s.id]);

  const toggleSection = (id: keyof FormattingOptions['sections'], checked: boolean) => {
    onChange({ ...formatting, sections: { ...formatting.sections, [id]: checked } });
  };

  const setAll = (checked: boolean) => {
    const sections = { ...formatting.sections };
    SECTION_LABELS.forEach((s) => {
      sections[s.id] = checked;
    });
    onChange({ ...formatting, sections });
  };

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute right-4 sm:right-8 top-16 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Bullets &amp; bold</h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formatting.enabled}
            onChange={(e) => onChange({ ...formatting, enabled: e.target.checked })}
            className="mt-1 w-4 h-4 accent-blue-600 shrink-0"
          />
          <span>
            <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">Use bullet points</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              Put each achievement on its own line in a description and it renders as its own bullet.
              Wrap text in <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">**like this**</code> anywhere
              to make it bold. Applies only to the sections checked below.
            </span>
          </span>
        </label>

        <div className={`mt-4 pl-7 space-y-2 ${formatting.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Apply to</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAll(true)}
                disabled={allChecked}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setAll(false)}
                disabled={noneChecked}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                None
              </button>
            </div>
          </div>

          {SECTION_LABELS.map((section) => (
            <label key={section.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formatting.sections[section.id]}
                onChange={(e) => toggleSection(section.id, e.target.checked)}
                className="w-3.5 h-3.5 accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{section.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormattingSettings;

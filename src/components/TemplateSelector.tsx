// FILE: src/components/TemplateSelector.tsx

import React from 'react';
import { Check, X } from 'lucide-react';
import { TEMPLATES } from '../types/resume';
import type { TemplateId } from '../types/resume';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  onClose: () => void;
}

const SWATCH_STYLES: Record<TemplateId, React.CSSProperties> = {
  classic: { background: 'linear-gradient(180deg, #1e40af 0 30%, #ffffff 30%)' },
  modern: { background: 'linear-gradient(90deg, #111827 0 34%, #ffffff 34%)' },
  minimal: { background: '#ffffff', border: '1px solid #d1d5db' },
  creative: { background: 'linear-gradient(180deg, #ffffff 0 20%, #dc2626 20% 24%, #ffffff 24%)' },
  executive: { background: 'linear-gradient(180deg, #ffffff 0 78%, #9c7a3c 78% 80%, #ffffff 80%)', border: '1px solid #0b1f3a' },
  technical: { background: '#0d1117' },
  editorial: { background: 'linear-gradient(180deg, #faf9f6 0 26%, #1c1c1c 26% 29%, #faf9f6 29%)' },
  compact: { background: 'linear-gradient(90deg, #ffffff 0 32%, #e5e7eb 32% 33%, #ffffff 33%)', border: '1px solid #d1d5db' },
  bold: { background: 'linear-gradient(135deg, #6d28d9 0 60%, #ffffff 60%)' },
  academic: { background: 'linear-gradient(180deg, #ffffff 0 22%, #7f1d1d 22% 24%, #ffffff 24%)' },
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Choose a template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {TEMPLATES.map((tpl) => {
            const isSelected = tpl.id === selected;
            return (
              <button
                key={tpl.id}
                onClick={() => {
                  onSelect(tpl.id);
                  onClose();
                }}
                className={`text-left rounded-lg border-2 overflow-hidden transition-colors ${
                  isSelected ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-28 w-full" style={SWATCH_STYLES[tpl.id]} />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{tpl.name}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{tpl.description}</p>
                  {!tpl.supportsPhoto && <p className="text-xs text-gray-400 mt-1">No photo support</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;

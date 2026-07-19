// FILE: src/components/ThemeToggle.tsx

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../context/ThemeContext';

// Single button that cycles: light -> dark -> system -> light ...
const CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

const ICONS: Record<ThemeMode, React.FC<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useTheme();
  const Icon = ICONS[mode];

  const handleClick = () => {
    const nextIndex = (CYCLE.indexOf(mode) + 1) % CYCLE.length;
    setMode(CYCLE[nextIndex]);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Theme: ${LABELS[mode]} (click to change)`}
      aria-label={`Theme: ${LABELS[mode]}. Click to switch theme.`}
      className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium hidden sm:inline">{LABELS[mode]}</span>
    </button>
  );
};

export default ThemeToggle;

'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Cambiar tema">
      {dark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

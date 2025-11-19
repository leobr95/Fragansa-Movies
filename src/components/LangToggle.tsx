'use client';
import { useI18n } from '@/lib/i18n';

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const onToggle = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
  };
  return (
    <button className="pill-btn" onClick={onToggle} aria-label="Language">
      {lang.toUpperCase()}
    </button>
  );
}

import { cookies } from 'next/headers';
import I18nProvider from '@/lib/i18n';

export default async function I18nServerProvider({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;

  const initialLang = cookieLang === 'en' ? 'en' : 'es'; // default 'es'
  return <I18nProvider initialLang={initialLang}>{children}</I18nProvider>;
}
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme';
import I18nServerProvider from '@/providers/I18nServerProvider';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Fragansa App',
  description: 'Debts Frontend',
};

const setThemeScript = `
(function(){
  try {
    var s = localStorage.getItem('theme');
    var dark = s ? (s === 'dark') : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
      </head>
      <body>
        <I18nServerProvider>
          <ThemeProvider>
            <div className="layout">
              <Sidebar />
              <main className="main">{children}</main>
            </div>
          </ThemeProvider>
        </I18nServerProvider>
      </body>
    </html>
  );
}

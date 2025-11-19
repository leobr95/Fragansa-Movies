'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import ThemeToggle from '@/components/ThemeToggle';
import LangToggle from '@/components/LangToggle';
import { useAuth } from '@/store/auth';
import {
  LogOut,
  User as UserIcon,
  Clapperboard,
  Globe2,
  Users,
  Film,
  Tag,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import fragansaLogo from '@/components/../app/logos/logofragansa.png';

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

function useIsHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function Sidebar(): React.JSX.Element | null {
  const path = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const hydrated = useIsHydrated();

  const { token, user, initFromStorage, loadMe, logout } = useAuth();

  const [navOpen, setNavOpen] = React.useState(true);

  React.useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  React.useEffect(() => {
    if (!token) return;
    loadMe().catch(() => {
      logout();
      router.replace('/login');
    });
  }, [token, loadMe, logout, router]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 720) {
      setNavOpen(false);
    }
  }, []);

  // <<< AQUÍ definimos si está autenticado
  const isAuthed = hydrated && Boolean(token);

  // <<< SI NO ESTÁ LOGUEADO, NO RENDERIZAMOS EL SIDEBAR
  if (!isAuthed) {
    return null;
  }

  const NAV: Item[] = [
    { href: '/directors', label: t('directors') ?? 'Directors', icon: Clapperboard },
    { href: '/genres', label: t('genres') ?? 'Genres', icon: Tag },
    { href: '/countries', label: t('countries') ?? 'Countries', icon: Globe2 },
    { href: '/actors', label: t('actors') ?? 'Actors', icon: Users },
    { href: '/movies', label: t('movies') ?? 'Movies', icon: Film },
  ];

  // const AUTH: Item[] = [
  //   { href: '/login', label: t('login') ?? 'Login', icon: LogIn },
  //   { href: '/register', label: t('register') ?? 'Register', icon: UserPlus },
  // ];

  const handleLogout = (): void => {
    logout();
    router.replace('/login');
  };

  const toggleNav = (): void => {
    setNavOpen((prev) => !prev);
  };

  const handleNavClick = (): void => {
    if (typeof window !== 'undefined' && window.innerWidth < 720) {
      setNavOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${navOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="card neo fill">
        <div className="side-header">
          <Image
            src={fragansaLogo}
            alt="Fragansa Logo"
            height={26}
            className="brand-logo"
          />

          <div className="ml-auto row gap-8">
            <button
              type="button"
              className="icon-btn menu-toggle"
              onClick={toggleNav}
              aria-label={
                navOpen
                  ? t('closeMenu') ?? 'Close menu'
                  : t('openMenu') ?? 'Open menu'
              }
            >
              {navOpen ? (
                <X size={18} className="nav-icon" />
              ) : (
                <Menu size={18} className="nav-icon" />
              )}
            </button>

            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="user-chip" title={user?.email ?? ''}>
          <UserIcon size={18} className="nav-icon" />
          <span className="nav-text">
            {user?.fullName || user?.email}
          </span>
        </div>

        {navOpen && (
          <nav className="side-nav">
            <ul className="nav-list">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  hydrated && (path === href || path.startsWith(`${href}/`));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      className={`nav-item ${active ? 'active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={handleNavClick}
                    >
                      <Icon size={18} className="nav-icon" />
                      <span className="nav-text">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="divider" />

            {/* Como el sidebar solo se muestra logueado,
                ya no necesitamos mostrar los links de login/register aquí.
                Dejé AUTH por si luego quieres reusarlo en otro sitio. */}

            <ul className="nav-list">
              <li>
                <button
                  type="button"
                  className="nav-item btn"
                  onClick={() => {
                    handleLogout();
                    handleNavClick();
                  }}
                >
                  <LogOut size={18} className="nav-icon" />
                  <span className="nav-text">
                    {t('logout') ?? 'Logout'}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        )}

        <div className="side-footer">
          © {CURRENT_YEAR} Leonardo David Burbano
        </div>
      </div>
    </aside>
  );
}

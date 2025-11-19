'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useI18n } from '@/lib/i18n';
import FormField from '@/components/FormField';
import Link from 'next/link';
import Image from 'next/image';
import fragansaLogo from '@/components/../app/logos/logofragansa.png'
import ThemeToggle from '@/components/ThemeToggle';
import LangToggle from '@/components/LangToggle';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const { t } = useI18n();
  const { register: reg, handleSubmit } = useForm<LoginForm>();
  const { doLogin, loading, error } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get('redirectTo') || '/movies';

  const onSubmit = async (data: LoginForm) => {
    const ok = await doLogin(data);
    if (ok) router.replace(redirectTo);
  };
return (
  <div className="auth-shell">
    {/* Columna izquierda: hero / ilustración */}
<div className="auth-hero">
  <div className="auth-hero-card card auth-card">
    <div className="auth-hero-header">
      <div className="" />

      <div className="auth-brand">
        <div className="auth-brand-header">
          <h2 className="auth-brand-title">Fragansa - Prueba técnica</h2>

          <div className="auth-brand-toggles">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <p className="auth-brand-sub">
          {t('movies') ?? 'Debts manager'}
        </p>

        <Image
          className="brand-logo-40"
          src={fragansaLogo}
          alt="Fragansa Logo"
          height={40}
        />
      </div>
    </div>

    <p className="auth-hero-text">
      Organiza catálogos de películas con una interfaz
      sencilla, moderna y neomórfica.
    </p>
  </div>
</div>


    {/* Columna derecha: tarjeta de login */}
    <div className="auth-panel">
      <div className="card auth-card neo">
        {/* Tabs arriba (Login / Register) */}
        <div className="auth-tabs">
          <span className="auth-tab active">
            {t('login') ?? 'Login'}
          </span>
          <Link
            href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="auth-tab"
          >
            {t('register') ?? 'Register'}
          </Link>
        </div>

        <h1 className="auth-title">{t('login')}</h1>

        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="auth-form"
          noValidate
        >
          <FormField label={t('email')}>
            <input
              className="neo-input"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              {...reg('email', { required: true })}
            />
          </FormField>

          <FormField label={t('password')}>
            <input
              className="neo-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...reg('password', { required: true })}
            />
          </FormField>

          <button
            className="btn auth-primary-btn"
            disabled={loading}
            aria-busy={loading}
            type="submit"
          >
            {loading ? t('loading') ?? '...' : t('login')}
          </button>
        </form>

        <div className="auth-footnote">
          <span>{t('noAccount') ?? 'No account?'}</span>{' '}
          <Link
            className="link"
            href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
          >
            {t('register')}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

}

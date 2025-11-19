'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useI18n } from '@/lib/i18n';
import FormField from '@/components/FormField';
import Link from 'next/link';
import Image from 'next/image';
import fragansaLogo from '@/components/../app/logos/logofragansa.png'
import LangToggle from '@/components/LangToggle';
import ThemeToggle from '@/components/ThemeToggle';
type RegisterForm = { email: string; password: string; fullName: string };

export default function RegisterPage() {
  const { t } = useI18n();
  const { register: reg, handleSubmit } = useForm<RegisterForm>();
  const { doRegister, loading, error } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get('redirectTo') || '/debts';

  const onSubmit = async (data: RegisterForm) => {
    const ok = await doRegister(data);
    if (ok) router.replace(redirectTo);
  };

  return (
  <div className="auth-shell">
    {/* Columna izquierda igual que en login (puedes cambiar texto si quieres) */}
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


    {/* Columna derecha: tarjeta de registro */}
    <div className="auth-panel">
      <div className="card auth-card neo">
        {/* Tabs arriba */}
        <div className="auth-tabs">
          <Link
            href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="auth-tab"
          >
            {t('login') ?? 'Login'}
          </Link>
          <span className="auth-tab active">
            {t('register') ?? 'Register'}
          </span>
        </div>

        <h1 className="auth-title">{t('register')}</h1>

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
          <FormField label={t('fullName')}>
            <input
              className="neo-input"
              placeholder="John Doe"
              autoComplete="name"
              {...reg('fullName', { required: true })}
            />
          </FormField>

          <FormField label={t('email')}>
            <input
              className="neo-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...reg('email', { required: true })}
            />
          </FormField>

          <FormField label={t('password')}>
            <input
              className="neo-input"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...reg('password', { required: true })}
            />
          </FormField>

          <button
            className="btn auth-primary-btn"
            disabled={loading}
            type="submit"
            aria-busy={loading}
          >
            {loading ? t('loading') ?? '...' : t('register')}
          </button>
        </form>

        <div className="auth-footnote">
          <span>{t('haveAccount') ?? 'Already have an account?'}</span>{' '}
          <Link
            className="link"
            href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          >
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

}

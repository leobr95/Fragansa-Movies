'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import {
  ShieldCheck,
  Clapperboard,
  Film,
  Users,
  Globe,
  LayoutGrid,
  PlayCircle,
  Languages,
  Moon,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useI18n();
  const { token } = useAuth();

  const features = [
    {
      icon: ShieldCheck,
      title: 'JWT Auth',
      desc: 'Registro, login y rutas protegidas para todo el catálogo.',
    },
    {
      icon: Clapperboard,
      title: 'Catálogo de películas',
      desc: 'CRUD completo de películas con reseña, portada y datos básicos.',
    },
    {
      icon: Users,
      title: 'Directores y actores',
      desc: 'Mantenimiento de directores, actores y su relación con las películas.',
    },
    {
      icon: Globe,
      title: 'Países y géneros',
      desc: 'Gestión de países de origen y géneros cinematográficos.',
    },
    {
      icon: LayoutGrid,
      title: 'Modo tabla / tarjetas',
      desc: 'Listado en tabla o tarjetas con vista detallada en modal.',
    },
    {
      icon: PlayCircle,
      title: 'Trailers y búsqueda',
      desc: 'Embebido de trailers de YouTube y botón para buscar la película en Google.',
    },
    {
      icon: Languages,
      title: 'i18n',
      desc: 'Interfaz en ES/EN con cambio de idioma en tiempo real.',
    },
    {
      icon: Moon,
      title: 'Tema & Neumorfismo',
      desc: 'Modo claro/oscuro y estilos con efecto neumórfico.',
    },
  ];

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero neo">
        <div className="container">
          <div className="hero-badge">Leonardo Burbano • 2025</div>
          <h1 className="hero-title">Fragansa Movies</h1>
          <p className="hero-subtitle">
            SPA de catálogo de películas con autenticación JWT, CRUD de
            catálogos (países, géneros, directores y actores), vista en
            tabla/tarjetas, trailers de YouTube, i18n y tema oscuro con
            neumorfismo.
          </p>
          <div className="hero-cta">
            <Link
              href={token ? '/movies' : '/login'}
              className="btn btn-primary btn-lg"
            >
              {token ? 'Ir a mis películas' : 'Ingresar / Registrarme'}
            </Link>

          </div>

          {/* mock de “screenshot” */}
          <div className="screenshot neo">
            <div className="screen-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="screen-title">Movies UI</span>
            </div>
            <div className="screen-body">
              <div className="screen-card neo" />
              <div className="screen-card neo" />
              <div className="screen-card neo" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">¿Qué puedes hacer en la app?</h2>
          <p className="section-subtitle">
            Estas son las principales características implementadas en el
            proyecto de películas:
          </p>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="feature-card neo">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Cómo funciona</h2>
          <ol className="steps">
            <li className="step neo">
              <div className="step-num">1</div>
              <div>
                <div className="step-title">Autentícate</div>
                <div className="step-desc">
                  Regístrate o inicia sesión para obtener tu JWT y acceder al
                  panel.
                </div>
              </div>
            </li>
            <li className="step neo">
              <div className="step-num">2</div>
              <div>
                <div className="step-title">Configura los catálogos</div>
                <div className="step-desc">
                  Crea países, géneros, directores y actores desde sus
                  pantallas dedicadas.
                </div>
              </div>
            </li>
            <li className="step neo">
              <div className="step-num">3</div>
              <div>
                <div className="step-title">Registra y explora películas</div>
                <div className="step-desc">
                  Da de alta películas con portada, reseña, elenco y trailer;
                  visualízalas en tabla o tarjetas y consulta más información en
                  Google.
                </div>
              </div>
            </li>
          </ol>

          <div className="center">
            <Link
              href={token ? '/movies' : '/login'}
              className="btn btn-primary btn-lg"
            >
              {token ? 'Ir al catálogo de películas' : 'Comenzar ahora'}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="muted">
              © {new Date().getFullYear()} Double V Partners
            </div>
            <div className="footer-links">
              {/* Ajusta las URLs reales de tu API de películas */}
              <a
                href="http://localhost:5001/swagger/index.html"
                className="muted"
              >
                Swagger Movies
              </a>
              <a
                href="http://localhost:5001/swagger/index.html"
                className="muted"
              >
                Swagger Auth
              </a>
              <a
                href="https://github.com/leobr95/DebtsDocumental/wiki#postman-collection"
                className="muted"
              >
                Wiki / Postman
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

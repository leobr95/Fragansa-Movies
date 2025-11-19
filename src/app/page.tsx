'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/store/auth';
import {
  ShieldCheck,
  Clapperboard,
  Users,
  Globe,
  LayoutGrid,
  PlayCircle,
  Languages,
  Moon,
  DownloadCloud,
  Database,
  Server,
  Code2,
  ExternalLink,
  Bell,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

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
      desc: 'Modo claro/oscuro, estilos neumórficos y layout 100% responsive.',
    },
    {
      icon: Bell,
      title: 'SweetAlert2',
      desc: 'Confirmaciones y mensajes de éxito/error amigables con SweetAlert2.',
    },
  ];

  const postmanCollectionUrl =
    'https://github.com/leobr95/FragansaCollectionApi/blob/main/API%20REST%20COLLECTION.json';

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero neo">
        <div className="container">
                    <div className="auth-brand-toggles">
                      <ThemeToggle /><br />
                    </div>
          <div className="hero-badge">Leonardo Burbano • 2025</div>
          <h1 className="hero-title">Fragansa Movies</h1>
          <p className="hero-subtitle">
            SPA de catálogo de películas con autenticación JWT, CRUD de
            catálogos (países, géneros, directores y actores), vista en
            tabla/tarjetas, trailers de YouTube, i18n y tema oscuro con
            neumorfismo. Totalmente responsive y con notificaciones
            amigables usando SweetAlert2.
          </p>

          <div className="hero-cta">
            <Link
              href={token ? '/movies' : '/login'}
              className="btn btn-primary btn-lg"
            >
              {token ? 'Ir a mis películas' : 'Ingresar / Registrarme'}
            </Link>

            <a
              href={postmanCollectionUrl} target='_blank'
              className="btn btn-ghost btn-lg"
              download
            >
              <DownloadCloud size={18} style={{ marginRight: 8 }} />
              Descargar colección Postman
            </a>
          </div>

          <div className="hero-cta" style={{ marginTop: 16 }}>
            <a
              href="https://leonardoburbano-portfolio.vercel.app/perfil"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              <ExternalLink size={16} style={{ marginRight: 6 }} />
              Ver perfil de desarrollador
            </a>
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

      {/* INFRA & TECH SECTION */}
      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Arquitectura técnica & despliegue</h2>
          <p className="section-subtitle">
            Fragansa Movies está construido siguiendo una arquitectura de
            microservicios con un frontend moderno en Next.js.
          </p>

          <div className="feature-grid">
            <article className="feature-card neo">
              <div className="feature-icon">
                <Database size={22} />
              </div>
              <h3 className="feature-title">Base de datos</h3>
              <p className="feature-desc">
                Se usa PostgreSQL desplegado en la nube (Aiven). El backend
                está preparado también para SQL Server, pero se eligió
                PostgreSQL por contar con una opción gratuita para la prueba
                técnica.
              </p>
              <ul className="small muted" style={{ marginTop: 8 }}>
                <li>Proveedor: PostgreSQL (Aiven)</li>
                <li>Entidades: Películas, actores, directores, países, géneros</li>
              </ul>
            </article>

            <article className="feature-card neo">
              <div className="feature-icon">
                <Server size={22} />
              </div>
              <h3 className="feature-title">Microservicios en .NET</h3>
              <p className="feature-desc">
                La solución está dividida en dos APIs .NET:
              </p>
              <ul className="small muted" style={{ marginTop: 8 }}>
                <li>
                  <strong>Auth API</strong>: manejo de registro, login y emisión
                  de JWT.
                </li>
                <li>
                  <strong>Movies API</strong>: gestión de películas,
                  catálogos.
                </li>
                <li>Ambas APIs se desplegaron en Render usando contenedores Docker.</li>
              </ul>
            </article>

            <article className="feature-card neo">
              <div className="feature-icon">
                <Code2 size={22} />
              </div>
              <h3 className="feature-title">Frontend en Vercel</h3>
              <p className="feature-desc">
                El frontend está desarrollado con Next.js 15, React, TypeScript
                y estilos neumórficos, desplegado en Vercel.
              </p>
              <p className="feature-desc small" style={{ marginTop: 8 }}>
                La comunicación con las APIs se realiza usando las siguientes
                variables de entorno:
              </p>
              <pre className="small" style={{ marginTop: 8 }}>
                NEXT_PUBLIC_AUTH_API_BASE=https://auth-api-latest.onrender.com{'\n'}
                NEXT_PUBLIC_API_BASE_URL=https://debts-api-latest.onrender.com
              </pre>
            </article>
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="section">
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

          <div className="center" style={{ gap: 12, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href={token ? '/movies' : '/login'}
              className="btn btn-primary btn-lg"
            >
              {token ? 'Ir al catálogo de películas' : 'Comenzar ahora'}
            </Link>

            <a
              href={postmanCollectionUrl} target='_blank'
              className="btn btn-ghost btn-lg"
              download
            >
              <DownloadCloud size={18} style={{ marginRight: 8 }} />
              Descargar colección Postman
            </a>
          </div>
        </div>
      </section>

      {/* DOCS & LINKS */}
      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Código fuente & documentación</h2>
          <p className="section-subtitle">
            Revisa el código, la documentación de Swagger y prueba los
            endpoints con Postman.
          </p>

          <div className="feature-grid">
            <article className="feature-card neo">
              <div className="feature-icon">
                <Code2 size={22} />
              </div>
              <h3 className="feature-title">Repositorios GitHub</h3>
              <ul className="small muted link-list">
                <li>
                  <a
                    href="https://github.com/leobr95/Fragansa-Movies"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Frontend – Fragansa Movies
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/leobr95/BackMoviesFragansa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Backend – Movies/Debts API
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/leobr95/BackAuthFragansa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Backend – Auth API
                  </a>
                </li>
              </ul>
            </article>

            <article className="feature-card neo">
              <div className="feature-icon">
                <Server size={22} />
              </div>
              <h3 className="feature-title">Swagger (APIs en Render)</h3>
              <ul className="small muted link-list">
                <li>
                  <a
                    href="https://auth-api-latest.onrender.com/swagger/index.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Swagger – Auth API
                  </a>
                </li>
                <li>
                  <a
                    href="https://debts-api-latest.onrender.com/swagger/index.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Swagger – Movies/Debts API
                  </a>
                </li>
              </ul>
            </article>

            <article className="feature-card neo">
              <div className="feature-icon">
                <DownloadCloud size={22} />
              </div>
              <h3 className="feature-title">Colección Postman</h3>
              <p className="feature-desc">
                Puedes importar la colección para probar rápidamente los
                endpoints de autenticación (Auth) y catálogo de películas /
                deudas.
              </p>
              <a
                href={postmanCollectionUrl} target='_blank'
                className="btn btn-primary btn-sm"
                download
              >
                <DownloadCloud size={16} style={{ marginRight: 6 }} />
                Descargar colección
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="muted">
              © {new Date().getFullYear()} Leonardo David Burbano
            </div>
            <div className="footer-links">
              <a
                href="https://auth-api-latest.onrender.com/swagger/index.html"
                className="muted"
                target="_blank"
                rel="noreferrer"
              >
                Swagger Auth
              </a>
              <a
                href="https://debts-api-latest.onrender.com/swagger/index.html"
                className="muted"
                target="_blank"
                rel="noreferrer"
              >
                Swagger Movies/Debts
              </a>
              <a
                href={postmanCollectionUrl} 
                className="muted"
                target="_blank"
                rel="noreferrer"
              >
                Colección Postman
              </a>
              <a
                href="https://leonardoburbano-portfolio.vercel.app/perfil"
                className="muted"
                target="_blank"
                rel="noreferrer"
              >
                Portafolio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

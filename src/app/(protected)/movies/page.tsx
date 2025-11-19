'use client';

import * as React from 'react';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/store/auth';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';

type Genre = {
  id: number;
  name: string;
};

type Country = {
  id: number;
  name: string;
};

type Director = {
  id: number;
  fullName: string;
};

type Actor = {
  id: number;
  fullName: string;
};

type Movie = {
  id: number;
  title: string;
  review: string;
  genreId: number;
  genreName: string;
  countryId: number;
  countryName: string;
  directorId: number;
  directorFullName: string;
  actorIds: number[];
  actorFullNames: string[];
  coverImageUrl: string;
  trailerCode: string;
};

type FormState = {
  id?: number;
  title: string;
  review: string;
  genreId: string;
  countryId: string;
  directorId: string;
  actorIds: string[];
  coverImageUrl: string;
  trailerCode: string;
};

type ApiErrorBody = {
  message?: string;
  errors?: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function getYoutubeId(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  // Si ya parece solo el ID
  if (!trimmed.includes('http') && !trimmed.includes('www.') && !trimmed.includes('/')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes('youtube.com')) {
      const vParam = url.searchParams.get('v');
      if (vParam) return vParam;

      const parts = url.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last) return last;
    }

    if (url.hostname === 'youtu.be') {
      const parts = url.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last) return last;
    }
  } catch {
    return trimmed;
  }

  return null;
}

export default function MoviesPage(): React.JSX.Element {
  const { t } = useI18n();
  const { token } = useAuth();

  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [directors, setDirectors] = React.useState<Director[]>([]);
  const [actors, setActors] = React.useState<Actor[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const [form, setForm] = React.useState<FormState>({
    title: '',
    review: '',
    genreId: '',
    countryId: '',
    directorId: '',
    actorIds: [],
    coverImageUrl: '',
    trailerCode: '',
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | undefined>();
  const [saving, setSaving] = React.useState(false);

  // película seleccionada para ver
  const [viewMovie, setViewMovie] = React.useState<Movie | null>(null);

  // modo de vista: tabla / tarjetas
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');

  const isTableView = viewMode === 'table';
  const isCardView = viewMode === 'cards';

  React.useEffect(() => {
    if (!token) return;
    void loadAll();
  }, [token]);

  async function loadAll(): Promise<void> {
    if (!token) return;

    try {
      setLoading(true);
      setError(undefined);

      const [moviesRes, genresRes, countriesRes, directorsRes, actorsRes] =
        await Promise.all([
          fetch(`${API_BASE}/api/Movies`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/Genres`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/Countries`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/Directors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/Actors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      if (!moviesRes.ok) throw new Error('Failed to load movies');
      if (!genresRes.ok) throw new Error('Failed to load genres');
      if (!countriesRes.ok) throw new Error('Failed to load countries');
      if (!directorsRes.ok) throw new Error('Failed to load directors');
      if (!actorsRes.ok) throw new Error('Failed to load actors');

      const moviesJson: Movie[] = await moviesRes.json();
      const genresJson: Genre[] = await genresRes.json();
      const countriesJson: Country[] = await countriesRes.json();
      const directorsJson: { id: number; firstName: string; lastName: string }[] =
        await directorsRes.json();
      const actorsJson: { id: number; firstName: string; lastName: string }[] =
        await actorsRes.json();

      setMovies(moviesJson);
      setGenres(genresJson);
      setCountries(countriesJson);
      setDirectors(
        directorsJson.map((d) => ({
          id: d.id,
          fullName: `${d.firstName} ${d.lastName}`,
        })),
      );
      setActors(
        actorsJson.map((a) => ({
          id: a.id,
          fullName: `${a.firstName} ${a.lastName}`,
        })),
      );
    } catch (loadError: unknown) {
      console.error(loadError);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function resetForm(): void {
    setForm({
      title: '',
      review: '',
      genreId: '',
      countryId: '',
      directorId: '',
      actorIds: [],
      coverImageUrl: '',
      trailerCode: '',
    });
    setIsEditing(false);
    setFormError(undefined);
  }

  function openCreateModal(): void {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  }

  function openEditModal(movie: Movie): void {
    setForm({
      id: movie.id,
      title: movie.title,
      review: movie.review,
      genreId: String(movie.genreId),
      countryId: String(movie.countryId),
      directorId: String(movie.directorId),
      actorIds: movie.actorIds.map((id) => String(id)),
      coverImageUrl: movie.coverImageUrl,
      trailerCode: movie.trailerCode,
    });
    setIsEditing(true);
    setFormError(undefined);
    setIsModalOpen(true);
  }

  function openViewModal(movie: Movie): void {
    setViewMovie(movie);
  }

  function closeViewModal(): void {
    setViewMovie(null);
  }

  function handleSearchOnGoogle(movie: Movie): void {
    const query = encodeURIComponent(movie.title);
    const url = `https://www.google.com/search?q=${query} pelicula`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function toggleViewMode(): void {
    setViewMode((prev) => (prev === 'table' ? 'cards' : 'table'));
  }

  async function handleDelete(movie: Movie): Promise<void> {
    if (!token) return;

    const result = await Swal.fire({
      title:
        t('confirmDelete') ??
        'Are you sure you want to delete this movie?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete') ?? 'Delete',
      cancelButtonText: t('cancel') ?? 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/Movies/${movie.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await safeJson(res);
        throw new Error(body?.message ?? 'Delete failed');
      }

      await Swal.fire({
        icon: 'success',
        title: t('movieDeleted') ?? 'Movie deleted.',
        timer: 1500,
        showConfirmButton: false,
      });

      await loadAll();
    } catch (deleteError: unknown) {
      console.error(deleteError);
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete movie';
      setFormError(message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!token) return;

    if (
      !form.title.trim() ||
      !form.review.trim() ||
      !form.genreId ||
      !form.countryId ||
      !form.directorId ||
      form.actorIds.length === 0 ||
      !form.coverImageUrl.trim() ||
      !form.trailerCode.trim()
    ) {
      const msg =
        t('movieFormError') ??
        'All fields are required and at least one actor, cover image and trailer code.';
      setFormError(msg);
      void Swal.fire({
        icon: 'warning',
        title: 'Oops',
        text: msg,
      });
      return;
    }

    setFormError(undefined);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      review: form.review.trim(),
      genreId: Number(form.genreId),
      countryId: Number(form.countryId),
      directorId: Number(form.directorId),
      actorIds: form.actorIds.map((id) => Number(id)),
      coverImageUrl: form.coverImageUrl.trim(),
      trailerCode: form.trailerCode.trim(),
    };

    const isEdit = Boolean(isEditing && form.id);

    try {
      const url = isEdit
        ? `${API_BASE}/api/Movies/${form.id as number}`
        : `${API_BASE}/api/Movies`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await safeJson(res);
        const msgFromApi =
          body?.errors?.join(' | ') ??
          body?.message ??
          (isEdit ? 'Update failed' : 'Create failed');
        throw new Error(msgFromApi);
      }

      await Swal.fire({
        icon: 'success',
        title: isEdit
          ? t('movieUpdated') ?? 'Movie updated.'
          : t('movieCreated') ?? 'New movie created.',
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      setIsModalOpen(false);
      await loadAll();
    } catch (submitError: unknown) {
      console.error(submitError);
      const message =
        submitError instanceof Error ? submitError.message : 'Operation failed';
      setFormError(message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setSaving(false);
    }
  }

  function handleActorsChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void {
    const options = Array.from(event.target.selectedOptions);
    setForm((f) => ({
      ...f,
      actorIds: options.map((option) => option.value),
    }));
  }

  const trailerId = getYoutubeId(form.trailerCode);
  const hasTrailerCode = Boolean(trailerId);
  const trailerUrl = trailerId
    ? `https://www.youtube.com/embed/${encodeURIComponent(trailerId)}`
    : '';

  // trailer para el modal de ver
  const viewTrailerId =
    viewMovie != null ? getYoutubeId(viewMovie.trailerCode) : null;

  const viewTrailerUrl =
    viewTrailerId != null
      ? `https://www.youtube.com/embed/${encodeURIComponent(viewTrailerId)}`
      : '';

  return (
    <AuthGuard>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t('movies') ?? 'Movies'}</h1>
          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={toggleViewMode}
            >
              {viewMode === 'table'
                ? t('cardMode') ?? 'Card mode'
                : t('tableMode') ?? 'Table mode'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={openCreateModal}
            >
              {t('newMovie') ?? 'New movie'}
            </button>
          </div>
        </div>

        <div className="panel neo">
          {loading && (
            <div className="muted">{t('loading') ?? 'Loading...'}</div>
          )}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <>
              {/* TABLA PRINCIPAL (MODO TABLA) */}
              {isTableView && (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t('title') ?? 'Title'}</th>
                        <th>{t('genre') ?? 'Genre'}</th>
                        <th>{t('country') ?? 'Country'}</th>
                        <th>{t('director') ?? 'Director'}</th>
                        <th>{t('actors') ?? 'Actors'}</th>
                        <th style={{ width: 180 }}>
                          {t('actions') ?? 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.length === 0 && (
                        <tr>
                          <td colSpan={6} className="muted">
                            {t('noResults') ?? 'No results'}
                          </td>
                        </tr>
                      )}
                      {movies.map((movie) => (
                        <tr key={movie.id}>
                          <td>{movie.title}</td>
                          <td>{movie.genreName}</td>
                          <td>{movie.countryName}</td>
                          <td>{movie.directorFullName}</td>
                          <td>{movie.actorFullNames.join(', ')}</td>
                          <td>
                            <div className="row gap-8">
                              <button
                                type="button"
                                className="btn-sm"
                                onClick={() => openViewModal(movie)}
                              >
                                {t('view') ?? 'View'}
                              </button>
                              <button
                                type="button"
                                className="btn-sm"
                                onClick={() => openEditModal(movie)}
                              >
                                {t('edit') ?? 'Edit'}
                              </button>
                              <button
                                type="button"
                                className="btn-sm danger"
                                onClick={() => void handleDelete(movie)}
                                disabled={saving}
                              >
                                {t('delete') ?? 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VISTA EN TARJETAS (MODO TARJETA) */}
              {isCardView && movies.length > 0 && (
                <>
                  <section className="movies-cards-section">
                    <h2 className="section-title">
                      {t('movies') ?? 'Movies'}
                    </h2>
                    <p className="muted" style={{ marginBottom: '12px' }}>
                      {t('moviesGridHint') ??
                        'Visual view of each movie with poster and trailer.'}
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      {movies.map((movie) => {
                        const cardTrailerId = getYoutubeId(movie.trailerCode);
                        const cardTrailerUrl =
                          cardTrailerId != null
                            ? `https://www.youtube.com/embed/${encodeURIComponent(
                                cardTrailerId,
                              )}`
                            : '';

                        return (
                          <article
                            key={movie.id}
                            className="card neo movie-card"
                            style={{
                              padding: '14px',
                              borderRadius: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <header
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <h3
                                style={{
                                  margin: 0,
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                }}
                              >
                                {movie.title}
                              </h3>
                              <span className="chip">
                                {movie.genreName}
                              </span>
                            </header>

                            <div
                              style={{
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-start',
                              }}
                            >
                              {movie.coverImageUrl && (
                                <div
                                  style={{
                                    width: '120px',
                                    flexShrink: 0,
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={movie.coverImageUrl}
                                    alt={movie.title}
                                    style={{
                                      width: '100%',
                                      borderRadius: '10px',
                                      objectFit: 'cover',
                                      aspectRatio: '2/3',
                                    }}
                                  />
                                </div>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                }}
                              >
                                <p
                                  className="muted"
                                  style={{
                                    fontSize: '0.85rem',
                                    margin: 0,
                                  }}
                                >
                                  {movie.review}
                                </p>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginTop: '6px',
                                  }}
                                >
                                  <span className="chip">
                                    <strong>
                                      {t('country') ?? 'Country'}:
                                    </strong>{' '}
                                    {movie.countryName}
                                  </span>
                                  <span className="chip">
                                    <strong>
                                      {t('director') ?? 'Director'}:
                                    </strong>{' '}
                                    {movie.directorFullName}
                                  </span>
                                </div>
                                <div style={{ marginTop: '4px' }}>
                                  <strong>
                                    {t('actors') ?? 'Actors'}:
                                  </strong>{' '}
                                  <span style={{ fontSize: '0.85rem' }}>
                                    {movie.actorFullNames.join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {cardTrailerUrl && (
                              <div
                                style={{
                                  marginTop: '8px',
                                }}
                              >
                                <div className="video-wrapper">
                                  <iframe
                                    width="100%"
                                    height="210"
                                    src={cardTrailerUrl}
                                    title={`${movie.title} trailer`}
                                    frameBorder={0}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}

                            {/* Botones en modo tarjeta */}
                            <div
                              className="row gap-8"
                              style={{ marginTop: '10px' }}
                            >
                              <button
                                type="button"
                                className="btn-sm"
                                onClick={() => openEditModal(movie)}
                              >
                                {t('edit') ?? 'Edit'}
                              </button>
                              <button
                                type="button"
                                className="btn-sm danger"
                                onClick={() => void handleDelete(movie)}
                                disabled={saving}
                              >
                                {t('delete') ?? 'Delete'}
                              </button>
                              <button
                                type="button"
                                className="btn-sm ghost"
                                onClick={() => handleSearchOnGoogle(movie)}
                              >
                                {t('searchOnGoogle') ?? 'Search on Google'}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              {/* MODAL CREAR / EDITAR */}
              {isModalOpen && (
                <div className="modal-backdrop">
                  <div className="modal neo">
                    <div className="modal-header">
                      <h2 className="section-title">
                        {isEditing
                          ? t('editMovie') ?? 'Edit movie'
                          : t('newMovie') ?? 'New movie'}
                      </h2>
                   

                      <button
                        type="button"
                        className="btn-sm ghost"
                        onClick={() => {
                          setIsModalOpen(false);
                          resetForm();
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {formError && (
                      <div className="error mb-8">{formError}</div>
                    )}

                  <form className="form" onSubmit={handleSubmit}>
  <div className="modal-body">
    <div className="modal-form-grid">
      {/* Título */}
      <div className="field full-row">
        <label className="label">
          {t('title') ?? 'Title'}
        </label>
        <input
          className="input"
          value={form.title}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              title: event.target.value,
            }))
          }
          required
        />
      </div>

      {/* Reseña */}
      <div className="field full-row">
        <label className="label">
          {t('review') ?? 'Review'}
        </label>
        <textarea
          className="input"
          rows={3}
          value={form.review}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              review: event.target.value,
            }))
          }
          required
        />
      </div>

      {/* Género */}
      <div className="field">
        <label className="label">
          {t('genre') ?? 'Genre'}
        </label>
        <select
          className="select"
          value={form.genreId}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              genreId: event.target.value,
            }))
          }
          required
        >
          <option value="">
            {t('selectGenre') ?? 'Select a genre'}
          </option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* País */}
      <div className="field">
        <label className="label">
          {t('country') ?? 'Country'}
        </label>
        <select
          className="select"
          value={form.countryId}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              countryId: event.target.value,
            }))
          }
          required
        >
          <option value="">
            {t('selectCountry') ?? 'Select a country'}
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Director */}
      <div className="field">
        <label className="label">
          {t('director') ?? 'Director'}
        </label>
        <select
          className="select"
          value={form.directorId}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              directorId: event.target.value,
            }))
          }
          required
        >
          <option value="">
            {t('selectDirector') ?? 'Select a director'}
          </option>
          {directors.map((director) => (
            <option key={director.id} value={director.id}>
              {director.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Actores */}
      <div className="field">
        <label className="label">
          {t('actors') ?? 'Actors'}
        </label>
        <select
          multiple
          className="select"
          value={form.actorIds}
          onChange={handleActorsChange}
          required
        >
          {actors.map((actor) => (
            <option key={actor.id} value={actor.id}>
              {actor.fullName}
            </option>
          ))}
        </select>
        <div className="muted small">
          {t('multiSelectHint') ??
            'Use Ctrl/Command + click to select multiple actors.'}
        </div>
      </div>

      {/* Cover + preview */}
      <div className="field full-row">
        <label className="label">
          {t('coverImageUrl') ?? 'Cover image URL'}
        </label>
        <input
          className="input"
          value={form.coverImageUrl}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              coverImageUrl: event.target.value,
            }))
          }
          required
        />
        {form.coverImageUrl.trim() && (
          <div className="movie-cover-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                height={75}
            width={50}
              src={form.coverImageUrl}
              alt={form.title || 'Movie cover'}
              className="movie-cover-preview-img"
            />
          </div>
        )}
      </div>

      {/* Trailer code */}
      <div className="field full-row">
        <label className="label">
          {t('trailerCode') ?? 'YouTube trailer code'}
        </label>
        <input
          className="input"
          value={form.trailerCode}
          onChange={(event) =>
            setForm((f) => ({
              ...f,
              trailerCode: event.target.value,
            }))
          }
          required
        />
        <div className="muted small">
          {t('trailerHint') ??
            'Use the YouTube video code (e.g. dQw4w9WgXcQ).'}
        </div>
      </div>

      {/* Preview trailer */}
      {hasTrailerCode && (
        <div className="field full-row">
          <label className="label">
            {t('trailerPreview') ?? 'Trailer preview'}
          </label>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src={trailerUrl}
              title="YouTube trailer preview"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>

    {/* Botones alineados y con más aire arriba */}
    <div className="row gap-8 row-actions">
      <button
        type="submit"
        className="btn"
        disabled={saving}
      >
        {isEditing
          ? t('update') ?? 'Update'
          : t('save') ?? 'Save'}
      </button>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        disabled={saving}
      >
        {t('cancel') ?? 'Cancel'}
      </button>
    </div>
  </div>
</form>

                  </div>
                </div>
              )}

              {/* MODAL VER DETALLE */}
              {viewMovie && (
                <div className="modal-backdrop">
                  <div className="modal neo">
                    <div className="modal-header">
                      <h2 className="section-title">
                        {viewMovie.title}
                      </h2>
                      <button
                        type="button"
                        className="btn-sm ghost"
                        onClick={closeViewModal}
                      >
                        ×
                      </button>
                    </div>

                    <div className="movie-view-body">
                      {/* Info a la izquierda, imagen a la derecha */}
                      <div className="row gap">
                        <div className="movie-review">
                          <h3 className="label">
                            {t('description') ?? 'Description'}
                          </h3>
                          <p>{viewMovie.review}</p>
                        </div>
                        <div
                          className="movie-poster"
                          style={{ maxWidth: '220px' }}
                        >
                          {viewMovie.coverImageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={viewMovie.coverImageUrl}
                              alt={viewMovie.title}
                              style={{
                                width: '100%',
                                borderRadius: '12px',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Chips con info básica */}
                      <div className="row gap-8 mt-16">
                        <div className="chip">
                          <strong>{t('genre') ?? 'Genre'}:</strong>{' '}
                          {viewMovie.genreName}
                        </div>
                        <div className="chip">
                          <strong>{t('country') ?? 'Country'}:</strong>{' '}
                          {viewMovie.countryName}
                        </div>
                      </div>

                      {/* Director + actores */}
                      <div className="movie-people mt-16">
                        <div className="movie-card">
                          <strong>{t('director') ?? 'Director'}</strong>
                          <p>{viewMovie.directorFullName}</p>
                        </div>
                        <div className="movie-card">
                          <strong>{t('actors') ?? 'Actors'}</strong>
                          <p>{viewMovie.actorFullNames.join(', ')}</p>
                        </div>
                      </div>

                      {/* Trailer */}
                      {viewTrailerUrl && (
                        <div className="field mt-16">
                          <label className="label">
                            {t('trailer') ?? 'Trailer'}
                          </label>
                          <div className="video-wrapper">
                            <iframe
                              width="560"
                              height="315"
                              src={viewTrailerUrl}
                              title="YouTube trailer"
                              frameBorder={0}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {/* Acciones con más espacio arriba */}
                                          <div className="row row-actions gap-8">
                                              <button
                                                  type="button"
                                                  className="btn ghost"
                                                  onClick={closeViewModal}
                                              >
                                                  {t('close') ?? 'Close'}
                                              </button>
                                              <button
                                                  type="button"
                                                  className="btn-accent"
                                                  onClick={() => handleSearchOnGoogle(viewMovie)}
                                              >
                                                  {t('searchOnGoogle') ?? 'Search on Google'}
                                              </button>
                                          </div>

                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

async function safeJson(res: Response): Promise<ApiErrorBody | undefined> {
  try {
    const data = (await res.json()) as ApiErrorBody;
    return data;
  } catch {
    return undefined;
  }
}

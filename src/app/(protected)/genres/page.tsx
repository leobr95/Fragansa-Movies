'use client';

import * as React from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/store/auth';
import { useI18n } from '@/lib/i18n';
import Swal from 'sweetalert2';

type Genre = {
  id: number;
  name: string;
};

type FormState = {
  id?: number;
  name: string;
};

type ErrorBody = {
  errors?: string[];
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export default function GenresPage() {
  const { t } = useI18n();
  const { token } = useAuth();

  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const [form, setForm] = React.useState<FormState>({ name: '' });
  const [isEditing, setIsEditing] = React.useState(false);
  const [formError, setFormError] = React.useState<string | undefined>();
  const [saving, setSaving] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadAll(): Promise<void> {
    if (!token) return;
    try {
      setLoading(true);
      setError(undefined);
      const res = await fetch(`${API_BASE}/api/Genres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load genres');

      const json = (await res.json()) as Genre[];
      setGenres(json);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function resetForm(): void {
    setForm({ name: '' });
    setIsEditing(false);
    setFormError(undefined);
  }

  function openCreateModal(): void {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  }

  function openEditModal(genre: Genre): void {
    setForm({ id: genre.id, name: genre.name });
    setIsEditing(true);
    setFormError(undefined);
    setIsModalOpen(true);
  }

  function closeModal(): void {
    setIsModalOpen(false);
    resetForm();
  }

  async function handleDelete(genre: Genre): Promise<void> {
    if (!token) return;

    const result = await Swal.fire({
      title: t('confirmDelete') ?? 'Are you sure?',
      text:
        t('confirmDeleteGenreText') ??
        'This will permanently delete the genre.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete') ?? 'Delete',
      cancelButtonText: t('cancel') ?? 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/Genres/${genre.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await safeJson(res);
        const message =
          (typeof body?.message === 'string' && body.message) ||
          'Delete failed';
        throw new Error(message);
      }

      await Swal.fire({
        icon: 'success',
        title: t('genreDeleted') ?? 'Genre deleted.',
        timer: 1500,
        showConfirmButton: false,
      });

      await loadAll();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setFormError('Failed to delete genre');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (!token) return;

    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }

    setFormError(undefined);
    setSaving(true);

    const payload = { name: form.name.trim() };
    const isEdit = Boolean(isEditing && form.id);

    try {
      const url = isEdit
        ? `${API_BASE}/api/Genres/${form.id as number}`
        : `${API_BASE}/api/Genres`;
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
        const msgFromErrors =
          Array.isArray(body?.errors) && body.errors.length > 0
            ? body.errors.join(' | ')
            : undefined;

        const message =
          msgFromErrors ??
          (typeof body?.message === 'string' ? body.message : undefined) ??
          (isEdit ? 'Update failed' : 'Create failed');

        throw new Error(message);
      }

      await Swal.fire({
        icon: 'success',
        title: isEdit
          ? (t('genreUpdated') ?? 'Genre updated.')
          : (t('genreCreated') ?? 'New genre created.'),
        timer: 1600,
        showConfirmButton: false,
      });

      closeModal();
      await loadAll();
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Operation failed';
      setFormError(message);
      void Swal.fire({
        icon: 'error',
        title: t('errorTitle') ?? 'Error',
        text: message,
      });
    } finally {
      setSaving(false);
    }
  }

  function handleBackdropClick(): void {
    // si quieres cerrar al hacer click en el fondo, descomenta:
    // closeModal();
  }

  return (
    <AuthGuard>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t('genres') ?? 'Genres'}</h1>
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={openCreateModal}
            >
              {t('newGenre') ?? 'New genre'}
            </button>
          </div>
        </div>

        <div className="panel neo">
          {loading && (
            <div className="muted">
              {t('loading') ?? 'Loading...'}
            </div>
          )}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('name') ?? 'Name'}</th>
                      <th style={{ width: 140 }}>
                        {t('actions') ?? 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres.length === 0 && (
                      <tr>
                        <td colSpan={2} className="muted">
                          {t('noResults') ?? 'No results'}
                        </td>
                      </tr>
                    )}
                    {genres.map((g) => (
                      <tr key={g.id}>
                        <td>{g.name}</td>
                        <td>
                          <div className="row gap-8">
                            <button
                              type="button"
                              className="btn-sm"
                              onClick={() => openEditModal(g)}
                            >
                              {t('edit') ?? 'Edit'}
                            </button>
                            <button
                              type="button"
                              className="btn-sm danger"
                              onClick={() => void handleDelete(g)}
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

              {/* Modal crear / editar género */}
              {isModalOpen && (
                <div
                  className="modal-backdrop"
                  onClick={handleBackdropClick}
                >
                  <div
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="genreModalTitle"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <h2
                      id="genreModalTitle"
                      className="modal-title"
                    >
                      {isEditing
                        ? t('editGenre') ?? 'Edit genre'
                        : t('newGenre') ?? 'New genre'}
                    </h2>

                    {formError && (
                      <div className="error mb-8">{formError}</div>
                    )}

                    <form
                      className="modal-form"
                      onSubmit={handleSubmit}
                    >
                      <div className="field">
                        <label className="label">
                          {t('name') ?? 'Name'}
                        </label>
                        <input
                          className="input"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          type="button"
                          className="btn ghost"
                          onClick={closeModal}
                          disabled={saving}
                        >
                          {t('cancel') ?? 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="btn-accent"
                          disabled={saving}
                        >
                          {saving
                            ? t('processing') ?? 'Processing…'
                            : isEditing
                            ? t('update') ?? 'Update'
                            : t('save') ?? 'Save'}
                        </button>
                      </div>
                    </form>
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

async function safeJson(res: Response): Promise<ErrorBody | undefined> {
  try {
    const data = (await res.json()) as ErrorBody;
    return data;
  } catch {
    return undefined;
  }
}

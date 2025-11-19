'use client';

import * as React from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/store/auth';
import { useI18n } from '@/lib/i18n';
import Swal from 'sweetalert2';

type Country = {
  id: number;
  name: string;
};

type Director = {
  id: number;
  firstName: string;
  lastName: string;
  countryId: number;
  countryName: string;
};

type FormState = {
  id?: number;
  firstName: string;
  lastName: string;
  countryId: string;
};

type ErrorBody = {
  errors?: string[];
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export default function DirectorsPage() {
  const { t } = useI18n();
  const { token } = useAuth();

  const [directors, setDirectors] = React.useState<Director[]>([]);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const [form, setForm] = React.useState<FormState>({
    firstName: '',
    lastName: '',
    countryId: '',
  });
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

      const [dirsRes, countriesRes] = await Promise.all([
        fetch(`${API_BASE}/api/Directors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/Countries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!dirsRes.ok) throw new Error('Failed to load directors');
      if (!countriesRes.ok) throw new Error('Failed to load countries');

      const dirsJson = (await dirsRes.json()) as Director[];
      const countriesJson = (await countriesRes.json()) as Country[];

      setDirectors(dirsJson);
      setCountries(countriesJson);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function resetForm(): void {
    setForm({
      firstName: '',
      lastName: '',
      countryId: '',
    });
    setIsEditing(false);
    setFormError(undefined);
  }

  function openCreateModal(): void {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  }

  function openEditModal(director: Director): void {
    setForm({
      id: director.id,
      firstName: director.firstName,
      lastName: director.lastName,
      countryId: String(director.countryId),
    });
    setIsEditing(true);
    setFormError(undefined);
    setIsModalOpen(true);
  }

  function closeModal(): void {
    setIsModalOpen(false);
    resetForm();
  }

  async function handleDelete(director: Director): Promise<void> {
    if (!token) return;

    const result = await Swal.fire({
      title: t('confirmDelete') ?? 'Are you sure?',
      text:
        t('confirmDeleteDirectorText') ??
        'This will permanently delete the director.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete') ?? 'Delete',
      cancelButtonText: t('cancel') ?? 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/Directors/${director.id}`, {
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
        title: t('directorDeleted') ?? 'Director deleted.',
        timer: 1500,
        showConfirmButton: false,
      });

      await loadAll();
    } catch (err) {
      console.error(err);
      setFormError('Failed to delete director');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (!token) return;

    if (!form.firstName.trim() || !form.lastName.trim() || !form.countryId) {
      setFormError('All fields are required.');
      return;
    }

    setFormError(undefined);
    setSaving(true);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      countryId: Number(form.countryId),
    };

    const isEdit = Boolean(isEditing && form.id);

    try {
      const url = isEdit
        ? `${API_BASE}/api/Directors/${form.id as number}`
        : `${API_BASE}/api/Directors`;

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
          ? (t('directorUpdated') ?? 'Director updated.')
          : (t('directorCreated') ?? 'New director created.'),
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
     closeModal();
  }

  return (
    <AuthGuard>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">
            {t('directors') ?? 'Directors'}
          </h1>
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={openCreateModal}
            >
              {t('newDirector') ?? 'New director'}
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
              {/* Tabla de directores */}
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('firstName') ?? 'First name'}</th>
                      <th>{t('lastName') ?? 'Last name'}</th>
                      <th>{t('country') ?? 'Country'}</th>
                      <th style={{ width: 140 }}>
                        {t('actions') ?? 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {directors.length === 0 && (
                      <tr>
                        <td colSpan={4} className="muted">
                          {t('noResults') ?? 'No results'}
                        </td>
                      </tr>
                    )}
                    {directors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.firstName}</td>
                        <td>{d.lastName}</td>
                        <td>{d.countryName}</td>
                        <td>
                          <div className="row gap-8">
                            <button
                              type="button"
                              className="btn-sm"
                              onClick={() => openEditModal(d)}
                            >
                              {t('edit') ?? 'Edit'}
                            </button>
                            <button
                              type="button"
                              className="btn-sm danger"
                              onClick={() => void handleDelete(d)}
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

              {/* Modal crear / editar director */}
              {isModalOpen && (
                <div
                  className="modal-backdrop"
                  onClick={handleBackdropClick}
                >
                  <div
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="directorModalTitle"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <h2
                      id="directorModalTitle"
                      className="modal-title"
                    >
                      {isEditing
                        ? t('editDirector') ?? 'Edit director'
                        : t('newDirector') ?? 'New director'}
                    </h2>

                    {formError && (
                      <div className="error mb-8">{formError}</div>
                    )}

                    <form
                      className="modal-form"
                      onSubmit={handleSubmit}
                    >
                      <div className="row gap">
                        <div className="field">
                          <label className="label">
                            {t('firstName') ?? 'First name'}
                          </label>
                          <input
                            className="input"
                            value={form.firstName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="field">
                          <label className="label">
                            {t('lastName') ?? 'Last name'}
                          </label>
                          <input
                            className="input"
                            value={form.lastName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label className="label">
                          {t('country') ?? 'Country'}
                        </label>
                        <select
                          className="select"
                          value={form.countryId}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              countryId: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="">
                            {t('selectCountry') ?? 'Select a country'}
                          </option>
                          {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
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

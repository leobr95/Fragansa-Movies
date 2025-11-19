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

type Actor = {
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

export default function ActorsPage() {
  const { t } = useI18n();
  const { token } = useAuth();

  const [actors, setActors] = React.useState<Actor[]>([]);
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

      const [actorsRes, countriesRes] = await Promise.all([
        fetch(`${API_BASE}/api/Actors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/Countries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!actorsRes.ok) {
        throw new Error('Failed to load actors');
      }
      if (!countriesRes.ok) {
        throw new Error('Failed to load countries');
      }

      const actorsJson = (await actorsRes.json()) as Actor[];
      const countriesJson = (await countriesRes.json()) as Country[];

      setActors(actorsJson);
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

  function openEditModal(actor: Actor): void {
    setForm({
      id: actor.id,
      firstName: actor.firstName,
      lastName: actor.lastName,
      countryId: String(actor.countryId),
    });
    setIsEditing(true);
    setFormError(undefined);
    setIsModalOpen(true);
  }

  function closeModal(): void {
    setIsModalOpen(false);
    resetForm();
  }

  async function handleDelete(actor: Actor): Promise<void> {
    if (!token) return;

    const result = await Swal.fire({
      title: t('confirmDelete') ?? 'Are you sure?',
      text:
        t('confirmDeleteActorText') ??
        'This will permanently delete the actor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('delete') ?? 'Delete',
      cancelButtonText: t('cancel') ?? 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/Actors/${actor.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await safeJson(res);
        const message =
          (body?.message as string | undefined) ?? 'Delete failed';
        throw new Error(message);
      }

      await Swal.fire({
        icon: 'success',
        title: t('actorDeleted') ?? 'Actor deleted.',
        timer: 1500,
        showConfirmButton: false,
      });

      await loadAll();
    } catch (err) {
      console.error(err);
      setFormError('Failed to delete actor');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
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
        ? `${API_BASE}/api/Actors/${form.id as number}`
        : `${API_BASE}/api/Actors`;
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
          Array.isArray(body?.errors) && body?.errors.length > 0
            ? body?.errors.join(' | ')
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
          ? t('actorUpdated') ?? 'Actor updated.'
          : t('actorCreated') ?? 'New actor created.',
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
    // si quieres que hacer click en el fondo cierre el modal:
    // closeModal();
  }

  return (
    <AuthGuard>
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{t('actors') ?? 'Actors'}</h1>
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={openCreateModal}
            >
              {t('newActor') ?? 'New actor'}
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
                      <th>{t('firstName') ?? 'First name'}</th>
                      <th>{t('lastName') ?? 'Last name'}</th>
                      <th>{t('country') ?? 'Country'}</th>
                      <th style={{ width: 140 }}>
                        {t('actions') ?? 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {actors.length === 0 && (
                      <tr>
                        <td colSpan={4} className="muted">
                          {t('noResults') ?? 'No results'}
                        </td>
                      </tr>
                    )}
                    {actors.map((actor) => (
                      <tr key={actor.id}>
                        <td>{actor.firstName}</td>
                        <td>{actor.lastName}</td>
                        <td>{actor.countryName}</td>
                        <td>
                          <div className="row gap-8">
                            <button
                              type="button"
                              className="btn-sm"
                              onClick={() => openEditModal(actor)}
                            >
                              {t('edit') ?? 'Edit'}
                            </button>
                            <button
                              type="button"
                              className="btn-sm danger"
                              onClick={() => void handleDelete(actor)}
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

              {/* MODAL: crear / editar actor */}
              {isModalOpen && (
                <div
                  className="modal-backdrop"
                  onClick={handleBackdropClick}
                >
                  <div
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="actorModalTitle"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <h2
                      id="actorModalTitle"
                      className="modal-title"
                    >
                      {isEditing
                        ? t('editActor') ?? 'Edit actor'
                        : t('newActor') ?? 'New actor'}
                    </h2>

                    {formError && (
                      <div className="error mb-8">{formError}</div>
                    )}

                    <form onSubmit={handleSubmit} className="modal-form">
                      <div className="row gap">
                        <div className="field">
                          <label className="label">
                            {t('firstName') ?? 'First name'}
                          </label>
                          <input
                            className="input"
                            value={form.firstName}
                            onChange={(ev) =>
                              setForm((prev) => ({
                                ...prev,
                                firstName: ev.target.value,
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
                            onChange={(ev) =>
                              setForm((prev) => ({
                                ...prev,
                                lastName: ev.target.value,
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
                          onChange={(ev) =>
                            setForm((prev) => ({
                              ...prev,
                              countryId: ev.target.value,
                            }))
                          }
                          required
                        >
                          <option value="">
                            {t('selectCountry') ?? 'Select a country'}
                          </option>
                          {countries.map((country) => (
                            <option
                              key={country.id}
                              value={country.id}
                            >
                              {country.name}
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

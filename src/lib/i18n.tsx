'use client';
import React from 'react';

export type Lang = 'en' | 'es';
const dict = {
  en: {
    // navigation / actions
    login: 'Login',
    logout: 'Logout',
    save: 'Save',
    list: 'List',
    create: 'Create',
    reload: 'Reload',
    delete: 'Delete',
    details: 'Details',
    cancel: 'Cancel',
    export: 'Export',
    exportCsv: 'Export CSV',
    exportJson: 'Export JSON',
    downloading: 'Downloading…',
    exportError: 'Error exporting file.',

    // menu & layout
    closeMenu: 'Close menu',
    openMenu: 'Open menu',

    // catalog navigation
    directors: 'Directors',
    genres: 'Genres',
    countries: 'Countries',
    actors: 'Actors',
    movies: 'Movies',

    actions: 'Actions',
    edit: 'Edit',
    update: 'Update',
    view: 'View',
    close: 'Close',
    cardMode: 'Card mode',
    tableMode: 'Table mode',

    // fields / labels
    title: 'Title',
    description: 'Description',
    email: 'Email',
    password: 'Password',
    fullName: 'Full name',

    name: 'Name',
    firstName: 'First name',
    lastName: 'Last name',
    country: 'Country',
    genre: 'Genre',
    review: 'Review',
    director: 'Director',
    actorsLabel: 'Actors',
    selectCountry: 'Select a country',
    selectGenre: 'Select a genre',
    selectDirector: 'Select a director',
    multiSelectHint: 'Use Ctrl/Command + click to select multiple actors.',
    coverImageUrl: 'Cover image URL',
    trailerCode: 'YouTube trailer code',
    trailerHint: 'Use the YouTube video code (e.g. dQw4w9WgXcQ).',
    trailerPreview: 'Trailer preview',
    trailer: 'Trailer',

    // UI feedback
    loading: 'Loading…',
    noResults: 'No results.',

    // auth extra
    register: 'Register',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    search: 'Search...',
    all: 'All',
    min: 'Min',
    max: 'Max',
    sort: 'Sort',
    count: 'Count',
    processing: 'Processing…',

    // generic CRUD confirmation
    confirmDelete: 'Are you sure you want to delete this item?',
    errorTitle: 'Error',

    // directors
    newDirector: 'New director',
    editDirector: 'Edit director',
    directorFormHint: 'Complete the fields to register a new director.',
    directorUpdated: 'Director updated.',
    directorCreated: 'New director created.',
    confirmDeleteDirectorText: 'Are you sure you want to delete this director?',
    directorDeleted: 'Director deleted.',

    // genres
    newGenre: 'New genre',
    editGenre: 'Edit genre',
    genreFormHint: 'Complete the fields to register a new genre.',
    genreUpdated: 'Genre updated.',
    genreCreated: 'New genre created.',
    confirmDeleteGenreText: 'Are you sure you want to delete this genre?',
    genreDeleted: 'Genre deleted.',

    // countries
    newCountry: 'New country',
    editCountry: 'Edit country',
    countryFormHint: 'Complete the fields to register a new country.',
    countryUpdated: 'Country updated.',
    countryCreated: 'New country created.',
    confirmDeleteCountryText: 'Are you sure you want to delete this country?',
    countryDeleted: 'Country deleted.',

    // actors
    newActor: 'New actor',
    editActor: 'Edit actor',
    actorFormHint: 'Complete the fields to register a new actor.',
    actorUpdated: 'Actor updated.',
    actorCreated: 'New actor created.',
    confirmDeleteActorText: 'Are you sure you want to delete this actor?',
    actorDeleted: 'Actor deleted.',

    // movies
    newMovie: 'New movie',
    editMovie: 'Edit movie',
    movieFormHint: 'Complete the fields to register a new movie.',
    movieUpdated: 'Movie updated.',
    movieCreated: 'New movie created.',
    movieDeleted: 'Movie deleted.',
    movieFormError:
      'All fields are required and at least one actor, cover image and trailer code.',
    moviesGridHint:
      'Visual view of each movie with poster and trailer.',

    // extra actions
    searchOnGoogle: 'Search on Google',
  },

  es: {
    // navegación / acciones
    login: 'Ingresar',
    logout: 'Salir',
    save: 'Guardar',
    list: 'Listado',
    create: 'Crear',
    reload: 'Recargar',
    delete: 'Eliminar',
    details: 'Detalles',
    cancel: 'Cancelar',
    export: 'Exportar',
    exportCsv: 'Exportar CSV',
    exportJson: 'Exportar JSON',
    downloading: 'Descargando…',
    exportError: 'Error exportando archivo.',

    // menú & layout
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',

    // navegación catálogo
    directors: 'Directores',
    genres: 'Géneros',
    countries: 'Países',
    actors: 'Actores',
    movies: 'Películas',

    actions: 'Acciones',
    edit: 'Editar',
    update: 'Actualizar',
    view: 'Ver',
    close: 'Cerrar',
    cardMode: 'Modo tarjeta',
    tableMode: 'Modo tabla',

    // campos / etiquetas
    title: 'Título',
    description: 'Descripción',
    email: 'Correo',
    password: 'Contraseña',
    fullName: 'Nombre completo',

    name: 'Nombre',
    firstName: 'Nombre',
    lastName: 'Apellido',
    country: 'País',
    genre: 'Género',
    review: 'Reseña',
    director: 'Director',
    actorsLabel: 'Actores',
    selectCountry: 'Selecciona un país',
    selectGenre: 'Selecciona un género',
    selectDirector: 'Selecciona un director',
    multiSelectHint:
      'Usa Ctrl/Command + clic para seleccionar varios actores.',
    coverImageUrl: 'URL de la imagen de portada',
    trailerCode: 'Código del tráiler en YouTube',
    trailerHint:
      'Usa el código del video de YouTube (por ejemplo: dQw4w9WgXcQ).',
    trailerPreview: 'Vista previa del tráiler',
    trailer: 'Tráiler',

    // feedback UI
    loading: 'Cargando…',
    noResults: 'Sin resultados.',

    // auth extra
    register: 'Registrar',
    haveAccount: '¿Ya tienes cuenta?',
    noAccount: '¿No tienes cuenta?',
    search: 'Buscar...',
    all: 'Todos',
    min: 'Mín.',
    max: 'Máx.',
    sort: 'Ordenar',
    count: 'Cantidad',
    processing: 'Procesando…',

    // mensajes confirmación / CRUD genéricos
    confirmDelete: '¿Seguro que deseas eliminar este registro?',
    errorTitle: 'Error',

    // directores
    newDirector: 'Nuevo director',
    editDirector: 'Editar director',
    directorFormHint:
      'Completa los campos para registrar un nuevo director.',
    directorUpdated: 'Director actualizado.',
    directorCreated: 'Nuevo director creado.',
    confirmDeleteDirectorText:
      '¿Seguro que deseas eliminar este director?',
    directorDeleted: 'Director eliminado.',

    // géneros
    newGenre: 'Nuevo género',
    editGenre: 'Editar género',
    genreFormHint:
      'Completa los campos para registrar un nuevo género.',
    genreUpdated: 'Género actualizado.',
    genreCreated: 'Nuevo género creado.',
    confirmDeleteGenreText:
      '¿Seguro que deseas eliminar este género?',
    genreDeleted: 'Género eliminado.',

    // países
    newCountry: 'Nuevo país',
    editCountry: 'Editar país',
    countryFormHint:
      'Completa los campos para registrar un nuevo país.',
    countryUpdated: 'País actualizado.',
    countryCreated: 'Nuevo país creado.',
    confirmDeleteCountryText:
      '¿Seguro que deseas eliminar este país?',
    countryDeleted: 'País eliminado.',

    // actores
    newActor: 'Nuevo actor',
    editActor: 'Editar actor',
    actorFormHint:
      'Completa los campos para registrar un nuevo actor.',
    actorUpdated: 'Actor actualizado.',
    actorCreated: 'Nuevo actor creado.',
    confirmDeleteActorText:
      '¿Seguro que deseas eliminar este actor?',
    actorDeleted: 'Actor eliminado.',

    // películas
    newMovie: 'Nueva película',
    editMovie: 'Editar película',
    movieFormHint:
      'Completa los campos para registrar una nueva película.',
    movieUpdated: 'Película actualizada.',
    movieCreated: 'Nueva película creada.',
    movieDeleted: 'Película eliminada.',
    movieFormError:
      'Todos los campos son obligatorios y debe haber al menos un actor, una portada y un código de tráiler.',
    moviesGridHint:
      'Vista visual de cada película con póster y tráiler.',

    // acciones extra
    searchOnGoogle: 'Buscar en Google',
  },
} as const;



type Keys = keyof typeof dict['en'];

type Ctx = {
  lang: Lang;
  t: (k: Keys) => string;
  setLang: (l: Lang) => void;
};

const I18nContext = React.createContext<Ctx | null>(null);

export default function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLang] = React.useState<Lang>(initialLang);

  React.useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  const t = React.useCallback((k: Keys) => dict[lang][k] ?? k, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

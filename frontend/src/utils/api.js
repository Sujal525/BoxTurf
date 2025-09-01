const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? import.meta.env.VITE_BACKEND_URL_LOCAL
  : import.meta.env.VITE_BACKEND_URL_DEPLOY;

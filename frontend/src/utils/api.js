// ✅ Detect current frontend origin
const origin = window.location.origin;

// ✅ Get env values (supports both Vite & CRA)
const LOCAL_URL =
  import.meta.env?.VITE_BACKEND_URL_LOCAL || process.env.REACT_APP_BACKEND_URL_LOCAL;

const DEPLOY_URL =
  import.meta.env?.VITE_BACKEND_URL_DEPLOY || process.env.REACT_APP_BACKEND_URL_DEPLOY;

// ✅ Choose API base dynamically
export const API_BASE_URL = origin.includes("localhost")
  ? LOCAL_URL
  : DEPLOY_URL;

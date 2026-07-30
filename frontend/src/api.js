import axios from "axios";

// On Vercel: frontend and API on same domain -> use relative /api
// Locally: set REACT_APP_BACKEND_URL to http://localhost:8001 or similar
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;

export async function getClub() {
  const { data } = await axios.get(`${API}/club`, { timeout: 30000 });
  return data;
}

export async function getPlayer(tag) {
  const { data } = await axios.get(`${API}/player/${encodeURIComponent(tag)}`, { timeout: 30000 });
  return data;
}

export const numberFmt = (n) =>
  (n ?? 0).toLocaleString("ru-RU").replace(/,/g, "\u00A0").replace(/\u00A0/g, " ");

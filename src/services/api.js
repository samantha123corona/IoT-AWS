// src/services/api.js
export const API_URL = process.env.REACT_APP_API_URL?.trim() || window.location.origin;

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "1",
};

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: defaultHeaders,
    ...options,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${txt}`);
  }

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

export async function insertEvent(payload) {
  console.log("Client info final antes de enviar:", payload);

  return apiFetch("/api/events", { method: "POST", body: JSON.stringify(payload) });
}

export function getLast10Movements(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : '';
  return apiFetch(`/api/movements/last10${qs}`);
}

export function getLast10Obstacles(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : "";
  // tu endpoint es /api/obstaculos/ultimos
  return apiFetch(`/api/obstaculos/ultimos${qs}`);
}

export function sendVelocidad(nivel) {
  return apiFetch("/api/velocidad", {
    method: "POST",
    body: JSON.stringify({ nivel }), // ← aquí el nombre coincide con el backend
  });
}


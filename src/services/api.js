const API_URL = process.env.REACT_APP_API_URL?.trim() || window.location.origin;

// Headers por defecto para todos los requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '1',
};

// Función genérica para hacer fetch y manejar errores
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: defaultHeaders,
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  // Intentamos parsear JSON, si falla devolvemos el texto
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

// Funciones de tu API
export async function insertEvent(payload) {
  console.log("InsertEvent payload:", payload); // <--- LOG DE DEPURACIÓN
  return apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


export function getLast10Movements(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : '';
  return apiFetch(`/api/movements/last10${qs}`);
}

export function getLast10Obstacles(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : '';
  return apiFetch(`/api/obstacles/last10${qs}`);
}

export { API_URL };

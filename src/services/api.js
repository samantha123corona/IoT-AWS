const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

export async function insertEvent(payload) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function getLast10Movements(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : '';
  const res = await fetch(`${API_URL}/api/movements/last10${qs}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function getLast10Obstacles(deviceId = null) {
  const qs = deviceId ? `?device_id=${deviceId}` : '';
  const res = await fetch(`${API_URL}/api/obstacles/last10${qs}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export { API_URL };
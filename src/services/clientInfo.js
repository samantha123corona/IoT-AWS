const CACHE_KEY = 'iot_client_info_v1';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutos

export async function getClientInfo() {

  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && (Date.now() - cached._ts) < CACHE_TTL_MS) {
      return cached.data;
    }
  } catch (e) { /* ignore */ }

  // nombre del dispositivo (persistido en localStorage)
  let nombre = localStorage.getItem('iot_device_name');
  if (!nombre) {
    const base = navigator.platform || (navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Device');
    nombre = `${base.replace(/\s+/g, '_').slice(0, 20)}-${Math.floor(Math.random() * 9000) + 100}`;
    localStorage.setItem('iot_device_name', nombre);
  }

  let ip = null, pais = null, ciudad = null, latitud = null, longitud = null;

  try {
    const r = await fetch('https://ipapi.co/json/');
    if (r.ok) {
      const j = await r.json();
      ip = j.ip || ip;
      pais = j.country_name || j.country || pais;
      ciudad = j.city || ciudad;
      latitud = j.latitude ?? j.lat ?? latitud;
      longitud = j.longitude ?? j.lon ?? longitud;
    }
  } catch (err) {
    console.warn('ipapi failed', err);
  }

  try {
    await new Promise((resolve) => {
      if (!navigator.geolocation) return resolve();
      const onSuccess = (pos) => {
        latitud = pos.coords.latitude;
        longitud = pos.coords.longitude;
        resolve();
      };
      const onError = () => resolve();
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 5000 });
    });
  } catch (e) { /* ignore */ }

  const data = { ip, pais, ciudad, longitud, latitud, nombre_dispositivo: nombre };
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ _ts: Date.now(), data })); } catch (e) { }

  const dataLog = {
    ip,
    pais,
    ciudad,
    longitud: longitud ?? 0,  // <-- si falla, ponemos 0
    latitud: latitud ?? 0,    // <-- si falla, ponemos 0
    nombre_dispositivo: nombre
  };

  console.log("Client info final antes de enviar:", dataLog);

  return data;
}
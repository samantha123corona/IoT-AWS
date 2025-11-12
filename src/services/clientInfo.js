// src/services/clientInfo.js
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
    const r = await fetch('https://ipwho.is/');

    if (r.ok) {
      const j = await r.json();
      ip = j.ip;
      pais = j.country || j.country_name;
      ciudad = j.city;
      latitud = j.latitude;
      longitud = j.longitude;
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

  const data = { 
  ip: ip || "No disponible", 
  pais: pais || "Desconocido", 
  ciudad: ciudad || "Desconocido", 
  longitud: longitud || 0, 
  latitud: latitud || 0, 
  nombre_dispositivo: nombre 
};

console.log("📡 Client info final antes de enviar:", data);

return data;
}

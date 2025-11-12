// src/App.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ControlRemote from "./components/ControlRemote";
import MonitorMovements from "./components/MonitorMovements";
import MonitorObstacles from "./components/MonitorObstacles";
import { insertEvent, getLast10Movements, getLast10Obstacles } from "./services/api";
import { getClientInfo } from "./services/clientInfo";
import socket from "./services/socket";

function App() {
  const [device, setDevice] = useState({ id: null, nombre_dispositivo: "ESP32_N1" });
  const [movements, setMovements] = useState([]);
  const [obstacles, setObstacles] = useState([]);

  const pushMovement = (event) => setMovements(prev => [event, ...prev].slice(0, 10));
  const pushObstacle = (ob) => setObstacles(prev => [ob, ...prev].slice(0, 10));

  // 🔁 REFRESH AUTOMÁTICO cada segundo — incluso sin ID
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [mRes, oRes] = await Promise.all([
          getLast10Movements(null), // <-- sin filtro, traer todos
          getLast10Obstacles(null)
        ]);

        if (mRes?.data) setMovements(mRes.data);
        if (oRes?.data) setObstacles(oRes.data);
      } catch (err) {
        console.warn("Auto-refresh error:", err.message);
      }
    }, 1000); // cada segundo

    return () => clearInterval(interval);
  }, [device.id]);

  // SOCKETS
  useEffect(() => {
    socket.on("connect", () => console.log("Socket conectado:", socket.id));
    socket.on("disconnect", () => console.log("Socket desconectado"));

    socket.on("nuevo_evento", (payload) => {
      if (!payload) return;
      const ev = Array.isArray(payload) ? payload[0] : payload;
      if (!ev) return;
      if (ev.movement_code != null) pushMovement(ev);
      if (ev.obstacle_code != null) pushObstacle(ev);
    });

    socket.on("nuevo_obstaculo", () => {
      getLast10Obstacles(device.id ?? 1)
        .then(r => { if (r?.data) setObstacles(r.data); })
        .catch(() => { });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("nuevo_evento");
      socket.off("nuevo_obstaculo");
    };
  }, [device.id]);
  // En App.jsx, modifica la función handleSend:
  async function handleSend({ movement_code = null, obstacle_code = null }) {
    try {
      console.log("Iniciando envío de evento...");

      const client = await getClientInfo();
      console.log("Datos del cliente obtenidos:", client);

      const payload = {
        device_id: device.id,
        movement_code,
        obstacle_code,
        ip: client.ip,
        pais: client.pais,
        ciudad: client.ciudad,
        longitud: client.longitud,
        latitud: client.latitud,
        nombre_dispositivo: client.nombre_dispositivo
      };

      console.log("Payload completo a enviar:", payload);

      const data = await insertEvent(payload);
      console.log("Respuesta del servidor:", data);

      if (Array.isArray(data.data) && data.data.length) {
        const row = data.data[0];
        if (row.device_id) setDevice((prev) => ({ ...prev, id: row.device_id }));
      }

      console.log("Evento enviado correctamente con geolocalización!");
    } catch (err) {
      console.error("Error completo insertando evento", err);
      alert("Error insertando evento: " + (err.message || err));
    }
  }
  return (
    <div className="container py-4">
      <h1 className="mb-3 text-center">IoT Control & Monitor (Realtime)</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <ControlRemote
            onSend={handleSend}  // ← Asegúrate de pasar onSend
            device={device}
            apiUrl={process.env.REACT_APP_API_URL?.trim() || window.location.origin}
          />
        </div>
        <div className="col-12 col-lg-8">
          <div className="card mb-3">
            <div className="card-header">Configuración</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Nombre dispositivo</label>
                <input
                  value={device.nombre_dispositivo}
                  className="form-control"
                  onChange={e => {
                    localStorage.setItem('iot_device_name', e.target.value);
                    setDevice(prev => ({ ...prev, nombre_dispositivo: e.target.value }));
                  }}
                />
              </div>
              <div>
                <label className="form-label">Device ID (opcional)</label>
                <input
                  value={device.id || ''}
                  className="form-control"
                  onChange={e => setDevice(prev => ({
                    ...prev,
                    id: e.target.value ? Number(e.target.value) : null
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <MonitorMovements events={movements} />
            </div>
            <div className="col-md-12">
              <MonitorObstacles obstacles={obstacles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

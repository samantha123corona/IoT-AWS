// src/App.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ControlRemote from "./components/ControlRemote";
import MonitorMovements from "./components/MonitorMovements";
import MonitorObstacles from "./components/MonitorObstacles";
import { insertEvent, getLast10Movements, getLast10Obstacles, sendVelocidad } from "./services/api";
import { getClientInfo } from "./services/clientInfo";
import socket from "./services/socket";

function App() {
  const [velocidad, setVelocidad] = useState(1); // default: 1 = Baja
  const [device, setDevice] = useState({ id: null, nombre_dispositivo: "ESP32_N1" });
  const [movements, setMovements] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  // 🔄 Función para cargar los últimos 10 elementos
  const loadLast10Data = async () => {
    try {
      console.log("🔄 Cargando últimos 10 elementos...");
      const [mRes, oRes] = await Promise.all([
        getLast10Movements(device.id),
        getLast10Obstacles(device.id)
      ]);

      if (mRes?.data) {
        setMovements(mRes.data);
        console.log(`📊 ${mRes.data.length} movimientos cargados`);
      }
      if (oRes?.data) {
        setObstacles(oRes.data);
        console.log(`🚧 ${oRes.data.length} obstáculos cargados`);
      }
    } catch (err) {
      console.warn("Error cargando datos:", err.message);
    }
  };

  // 📥 Cargar datos iniciales
  useEffect(() => {
    loadLast10Data();
  }, [device.id]);

  // 🔌 Configurar WebSockets - ACTUALIZADO
  useEffect(() => {
    //console.log("🔌 Configurando WebSocket...");

    const onConnect = () => {
      //console.log("✅ Socket conectado:", socket.id);
      setSocketConnected(true);
    };

    const onDisconnect = () => {
      //console.log("❌ Socket desconectado");
      setSocketConnected(false);
    };

    // 🎯 EVENTO PRINCIPAL: Cuando hay nueva inserción
    const onNuevoEvento = (payload) => {
      //console.log("📨 Nuevo evento recibido:", payload);
      loadLast10Data(); // Recargar los últimos 10 elementos
    };

    // 🚧 EVENTO PARA OBSTÁCULOS
    const onNuevoObstaculo = (payload) => {
      //console.log("🚧 Nuevo obstáculo recibido:", payload);
      loadLast10Data(); // Recargar los últimos 10 elementos
    };

    const onNuevaVelocidad = (value) => {
      //console.log("⚡ Nueva velocidad recibida:", value);
      setVelocidad(Number(value));
    };

    // Registrar eventos
    socket.on("nueva_velocidad", onNuevaVelocidad);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("nuevo_evento", onNuevoEvento);
    socket.on("nuevo_obstaculo", onNuevoObstaculo);

    // Conectar si no está conectado
    if (!socket.connected) {
      //console.log("🔄 Conectando socket...");
      socket.connect();
    }

    // Limpiar
    return () => {
      console.log("🧹 Limpiando listeners de socket");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("nuevo_evento", onNuevoEvento);
      socket.off("nuevo_obstaculo", onNuevoObstaculo);
      socket.off("nueva_velocidad", onNuevaVelocidad);
    };
  }, []);

  // 🎮 Función para enviar eventos
  async function handleSend({ movement_code = null, obstacle_code = null }) {
    try {
      //console.log("Iniciando envío de evento...");

      const client = await getClientInfo();
      //console.log("Datos del cliente obtenidos:", client);

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

      //console.log("Payload completo a enviar:", payload);

      const data = await insertEvent(payload);
      //console.log("Respuesta del servidor:", data);

      if (Array.isArray(data.data) && data.data.length) {
        const row = data.data[0];
        if (row.device_id) setDevice((prev) => ({ ...prev, id: row.device_id }));
      }

      //console.log("✅ Evento enviado correctamente!");

      // Opcional: Recargar datos después de enviar (para feedback inmediato)
      setTimeout(() => {
        loadLast10Data();
      }, 500);

    } catch (err) {
      //console.error("Error completo insertando evento", err);
      alert("Error insertando evento: " + (err.message || err));
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3 text-center">IoT Control & Monitor (Realtime)</h1>

      {/* Indicador de estado del socket */}
      <div className={`alert ${socketConnected ? 'alert-success' : 'alert-warning'} text-center`}>
        WebSocket: {socketConnected ? '✅ Conectado' : '⚠️ Desconectado'}
      </div>

      <div className="row g-4">
        <div className="alert alert-info text-center">
          Velocidad actual: {velocidad === 1 ? "Baja" : velocidad === 2 ? "Media" : "Alta"}
        </div>

        <div className="col-12 col-lg-4">
          <ControlRemote
            onSend={handleSend}
            onSpeed={async (v) => {
              try {
                await sendVelocidad(v); // función que haremos en api.js
              } catch (err) {
                console.error("Error enviando velocidad:", err);
              }
            }}
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
              <button
                className="btn btn-secondary mt-2"
                onClick={loadLast10Data}
              >
                🔄 Actualizar Datos
              </button>
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
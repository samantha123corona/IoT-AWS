// src/App.js
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import ControlRemote from './components/ControlRemote';
import MonitorTable from './components/MonitorTable';
import { insertEvent, getLast10Movements } from './services/api';
import { getClientInfo } from './services/clientInfo';
import { io } from 'socket.io-client';

function App() {
  const [device, setDevice] = useState({ id: null, nombre_dispositivo: 'ESP32_N1' });
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

  useEffect(() => {
    let pollingTimer = null;

    const fetchLast10 = async () => {
      try {
        const res = await getLast10Movements(device.id);
        if (res && res.data) setEvents(res.data);
      } catch (err) { console.error('fetchLast10', err); }
    };

    const connectSocket = () => {
      try {
        socketRef.current = io(API_URL, { transports: ['websocket'], reconnectionAttempts: 5 });

        socketRef.current.on('connect', () => {
          console.log('Socket conectado');
          if (pollingTimer) { clearInterval(pollingTimer); pollingTimer = null; }
        });

        socketRef.current.on('disconnect', () => {
          console.log('Socket desconectado');
          if (!pollingTimer) pollingTimer = setInterval(fetchLast10, 5000);
        });

        socketRef.current.on('connect_error', (e) => {
          console.warn('Socket connect_error', e);
          if (!pollingTimer) pollingTimer = setInterval(fetchLast10, 5000);
        });

        socketRef.current.on('nuevo_evento', (payload) => {
          if (!payload) return;
          if (payload.refresh) return fetchLast10();

          const event = Array.isArray(payload) && payload.length ? payload[0] : payload;
          setEvents(prev => {
            const arr = [event, ...prev].slice(0, 10);
            return arr;
          });
        });

      } catch (err) {
        console.warn('Socket no disponible', err);
        if (!pollingTimer) pollingTimer = setInterval(fetchLast10, 5000);
      }
    };

    fetchLast10();
    connectSocket();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (pollingTimer) clearInterval(pollingTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id]);

  async function handleSend({ movement_code = null, obstacle_code = null, demo_code = null }) {

    try {
      const client = await getClientInfo();

      const payload = {
        device_id: device.id,
        movement_code,
        obstacle_code,
        demo_code,
        ip: client.ip,
        pais: client.pais,
        ciudad: client.ciudad,
        longitud: client.longitud,
        latitud: client.latitud,
        nombre_dispositivo: client.nombre_dispositivo
      };

      const data = await insertEvent(payload);

      if (Array.isArray(data.data) && data.data.length) {
        const row = data.data[0];
        if (row.device_id) setDevice(prev => ({ ...prev, id: row.device_id }));
      }

      const last10 = await getLast10Movements(device.id);
      if (last10 && last10.data) setEvents(last10.data);
      const datalog = await insertEvent(payload);
      console.log("Respuesta API insertEvent:", datalog);


    } catch (err) {
      console.error('Error insertando evento', err);
      alert('Error insertando evento: ' + (err.message || err));
    }
  }

  return (
    <div className="container py-4">
      <div className="row mb-3">
        <div className="col-12">
          <h1>IoT Control & Monitor</h1>
          <p className="text-muted">Backend: {API_URL} — Socket: conectado si aparece en consola</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <ControlRemote onSend={handleSend} device={device} />
        </div>

        <div className="col-12 col-md-6">
          <div className="card mb-3">
            <div className="card-header">Configuración dispositivo</div>
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">Nombre del dispositivo</label>
                <input className="form-control" value={device.nombre_dispositivo}
                  onChange={e => { localStorage.setItem('iot_device_name', e.target.value); setDevice(prev => ({ ...prev, nombre_dispositivo: e.target.value })); }} />
              </div>
              <div className="mb-2">
                <label className="form-label">Device ID (opcional)</label>
                <input className="form-control" value={device.id || ''} onChange={e => setDevice(prev => ({ ...prev, id: e.target.value ? Number(e.target.value) : null }))} />
                <small className="text-muted">Si el dispositivo no existe, deje vacío y se creará al insertar el primer evento.</small>
              </div>
            </div>
          </div>

          <MonitorTable events={events} />
        </div>
      </div>
    </div>
  );
}

export default App;

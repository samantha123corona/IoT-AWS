import React from 'react';
import './ControlRemote.css';

export default function ControlRemote({ onSend, device }) {
  const send = (movement_code) => onSend({ movement_code });

  return (
    <div className="card mb-3">
      <div className="card-header">Control remoto</div>
      <div className="card-body">
        <div className="mb-2">
          <strong>Dispositivo:</strong> {device.nombre_dispositivo || 'Sin nombre'}{' '}
          {device.id ? <span className="badge bg-primary">ID {device.id}</span> : null}
        </div>

        <div className="control-remote">
          <div className="dpad">
            <button className="dpad-btn up" onClick={() => send(0)}>▲</button>
            <button className="dpad-btn left" onClick={() => send(4)}>◀</button>
            <button className="dpad-btn center" onClick={() => send(2)}>■</button>
            <button className="dpad-btn right" onClick={() => send(3)}>▶</button>
            <button className="dpad-btn down" onClick={() => send(1)}>▼</button>
          </div>

          <div className="extras mt-3">
            <div className="row gx-2">
              <div className="col">
                <button className="btn btn-outline-secondary w-100" onClick={() => send(7)}>Giro 90° →</button>
              </div>
              <div className="col">
                <button className="btn btn-outline-secondary w-100" onClick={() => send(8)}>Giro 90° ←</button>
              </div>
            </div>
            <div className="row gx-2 mt-2">
              <div className="col">
                <button className="btn btn-outline-warning w-100" onClick={() => send(9)}>Giro 360° →</button>
              </div>
              <div className="col">
                <button className="btn btn-outline-warning w-100" onClick={() => send(10)}>Giro 360° ←</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <small className="text-muted">Usa los botones para enviar comandos al dispositivo.</small>
        </div>
      </div>
    </div>
  );
}
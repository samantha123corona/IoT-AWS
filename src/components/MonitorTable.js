import React from 'react';

export default function MonitorTable({ events }) {
  return (
    <div className="card">
      <div className="card-header">Últimos movimientos (10)</div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dispositivo</th>
                <th>Movimiento</th>
                <th>Fecha</th>
                <th>IP</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>Lat, Long</th>
              </tr>
            </thead>
            <tbody>
              {events && events.length ? events.map(ev => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.id_dispositivo}</td>
                  <td>{ev.movement_text || ev.obstacle_text || '—' } ({ev.movement_code ?? ev.obstacle_code ?? '—'})</td>
                  <td>{ev.fecha_evento ? new Date(ev.fecha_evento).toLocaleString() : '—'}</td>
                  <td>{ev.ip_snapshot || '—'}</td>
                  <td>{ev.pais_snapshot || '—'}</td>
                  <td>{ev.ciudad_snapshot || '—'}</td>
                  <td>{(ev.latitud_snapshot || ev.longitud_snapshot) ? `${ev.latitud_snapshot ?? '—'}, ${ev.longitud_snapshot ?? '—'}` : '—'}</td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="text-center py-3">No hay eventos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

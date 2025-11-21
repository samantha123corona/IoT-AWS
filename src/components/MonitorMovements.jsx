// src/components/MonitorMovements.jsx
import React from "react";

export default function MonitorMovements({ events }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-success text-white fw-semibold d-flex justify-content-between align-items-center">
        <span>Últimos 10 movimientos</span>
        <small className="badge bg-light text-dark">
          {events.length} registros
        </small>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Dispositivo</th>
                <th>Nombre</th>
                <th>Movimiento</th>
                <th>Fecha</th>
                <th>IP</th>
                <th>Ubicación</th>
                <th>latitud</th>
                <th>longitud</th>
              </tr>
            </thead>
            <tbody>
              {events?.length ? (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{ev.id_dispositivo ?? "—"}</td>
                    <td>{ev.nombre_dispositivo ?? "—"}</td>
                    <td>
                      <strong>{ev.movement_text ?? "—"}</strong>
                      <br />
                      <small className="text-muted">Código: {ev.movement_code ?? ev.obstacle_code ?? "—"}</small>
                    </td>
                    <td>
                      {ev.fecha_evento ? new Date(ev.fecha_evento).toLocaleString() : "—"}
                    </td>
                    <td>{ev.ip_snapshot ?? ev.ip ?? "—"}</td>
                    <td>
                      {ev.ciudad_snapshot ?? ev.ciudad ?? "—"}
                      {ev.pais_snapshot || ev.pais ? `, ${ev.pais_snapshot ?? ev.pais}` : ""}
                    </td>
                    <td>{ev.latitud_snapshot ?? ev.latitud ?? "—"}</td>
                    <td>{ev.longitud_snapshot ?? ev.longitud ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-3 text-center text-muted">
                    Sin movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
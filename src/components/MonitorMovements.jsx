// src/components/MonitorMovements.jsx
import React from "react";

export default function MonitorMovements({ events }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-success text-white fw-semibold">
        Últimos 10 movimientos
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Dispositivo</th>
                <th>Nombre</th>
                <th>Movimiento (code)</th>
                <th>Fecha</th>
                <th>IP</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>Latitud</th>
                <th>Longitud</th>
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
                      {ev.movement_text ?? "—"} ({ev.movement_code ?? ev.obstacle_code ?? "—"})
                    </td>
                    <td>{ev.fecha_evento ? new Date(ev.fecha_evento).toLocaleString() : "—"}</td>
                    <td>{ev.ip_snapshot ?? ev.ip ?? "—"}</td>
                    <td>{ev.pais_snapshot ?? ev.pais ?? "—"}</td>
                    <td>{ev.ciudad_snapshot ?? ev.ciudad ?? "—"}</td>
                    <td>{ev.latitud_snapshot ?? ev.latitud ?? "—"}</td>
                    <td>{ev.longitud_snapshot ?? ev.longitud ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-3 text-center text-muted">
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

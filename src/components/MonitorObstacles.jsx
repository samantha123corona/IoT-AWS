// src/components/MonitorObstacles.jsx
import React from "react";

export default function MonitorObstacles({ obstacles }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-danger text-white fw-semibold">
        Últimos obstáculos detectados
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Distancia</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {obstacles?.length ? (
                obstacles.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.distancia_obstaculo}</td>
                    <td>{o.fecha_registro ?? o.created_at ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-muted">
                    Sin obstáculos registrados
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

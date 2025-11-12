// src/components/ControlRemote.js
import React from 'react';
import './ControlRemote.css';

export default function ControlRemote({ onSend }) {

  const sendMovement = async (movement_code) => {
    try {
      await onSend({ movement_code });
    } catch (err) {
      console.error("Error insertando evento:", err);
      alert(`Error insertando evento: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header bg-dark text-white">Control Remoto</div>
      <div className="card-body text-center">
        <div className="control-remote">
          
          {/* Flecha ARRIBA - Adelante */}
          <button 
            className="control-btn up-btn"
            onClick={() => sendMovement(0)}
            title="Adelante"
          >
            <span className="btn-icon">▲</span>
            <span className="btn-label">Adelante</span>
          </button>

          <div className="horizontal-controls">
            {/* Flecha IZQUIERDA */}
            <button 
              className="control-btn left-btn"
              onClick={() => sendMovement(4)}
              title="Izquierda"
            >
              <span className="btn-icon">◀</span>
              <span className="btn-label">Izquierda</span>
            </button>

            {/* CENTRO - FRENO (más grande y destacado) */}
            <button 
              className="control-btn center-btn stop-btn"
              onClick={() => sendMovement(2)}
              title="Frenar/Detener"
            >
              <span className="btn-icon">⏹</span>
              <span className="btn-label">Frenar</span>
            </button>

            {/* Flecha DERECHA */}
            <button 
              className="control-btn right-btn"
              onClick={() => sendMovement(3)}
              title="Derecha"
            >
              <span className="btn-icon">▶</span>
              <span className="btn-label">Derecha</span>
            </button>
          </div>

          {/* Flecha ABAJO - Reversa */}
          <button 
            className="control-btn down-btn"
            onClick={() => sendMovement(1)}
            title="Reversa"
          >
            <span className="btn-icon">▼</span>
            <span className="btn-label">Reversa</span>
          </button>

          {/* Controles adicionales - GIROS */}
          <div className="additional-controls">
            <div className="control-group">
              <h6>Vueltas hacia atras</h6>
              <div className="btn-group-horizontal">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => sendMovement(6)}
                  title="vuelta izq atras"
                >
                  ↶ Izq
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => sendMovement(5)}
                  title="vuelta derecha atras "
                >
                  Der ↷
                </button>
              </div>
            </div>
            <div className="control-group">
              <h6>Giros Rápidos 90°</h6>
              <div className="btn-group-horizontal">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => sendMovement(8)}
                  title="Giro 90° Izquierda"
                >
                  ↶ 90° Izq
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => sendMovement(7)}
                  title="Giro 90° Derecha"
                >
                  90° Der ↷
                </button>
              </div>
            </div>

            <div className="control-group">
              <h6>Giros Complejos 360°</h6>
              <div className="btn-group-horizontal">
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => sendMovement(10)}
                  title="Giro 360° Izquierda"
                >
                  ↶ 360° Izq
                </button>
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => sendMovement(9)}
                  title="Giro 360° Derecha"
                >
                  360° Der ↷
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
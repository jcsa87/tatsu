import React from "react";
import { Monitor, Zap } from "lucide-react";
import "./DailyMetrics.css";

export default function DailyMetrics({ sessionSeconds, focusSeconds }) {
  // Función para formatear (ej: "2h 15m")
  const format = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Cálculo visual para la barra (Base de 8 horas = 100% ancho)
  // Esto es solo estético, para que la barra crezca.
  const MAX_DAY_SECONDS = 8 * 60 * 60;

  const getWidth = (seconds) => {
    const pct = Math.min((seconds / MAX_DAY_SECONDS) * 100, 100);
    return `${Math.max(pct, 5)}%`; // Mínimo 5% para que se vea algo
  };

  return (
    <div className="daily-metrics-container">
      {/* 1. TIEMPO EN PC (SESIÓN) */}
      <div className="metric-pill">
        <div className="metric-icon-wrapper">
          <Monitor size={14} />
        </div>
        {/* Barra visual */}
        <div className="metric-bar-track">
          <div
            className="metric-bar-fill session"
            style={{ width: getWidth(sessionSeconds) }}
          />
        </div>

        {/* Tooltip Hover */}
        <div className="metric-tooltip">
          <span className="tooltip-label">Session Time</span>
          <span className="tooltip-value">{format(sessionSeconds)}</span>
        </div>
      </div>

      {/* Separador sutil */}
      <div className="metric-divider" />

      {/* 2. TIEMPO DE FOCO (CONCENTRACIÓN) */}
      <div className="metric-pill">
        <div className="metric-icon-wrapper">
          <Zap size={14} color="var(--accent-color)" />
        </div>
        {/* Barra visual */}
        <div className="metric-bar-track">
          <div
            className="metric-bar-fill focus"
            style={{ width: getWidth(focusSeconds) }}
          />
        </div>

        {/* Tooltip Hover */}
        <div className="metric-tooltip">
          <span className="tooltip-label">Deep Focus</span>
          <span
            className="tooltip-value"
            style={{ color: "var(--accent-color)" }}
          >
            {format(focusSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}

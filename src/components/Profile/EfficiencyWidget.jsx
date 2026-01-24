import React from "react";
import { Monitor, Zap, PieChart } from "lucide-react";

export default function EfficiencyWidget({ sessionSeconds, focusSeconds }) {
  // Cálculos de horas y minutos
  const format = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // Cálculo de Eficiencia (evitando división por cero)
  const efficiency =
    sessionSeconds > 0 ? Math.round((focusSeconds / sessionSeconds) * 100) : 0;

  // Color dinámico según eficiencia
  const getEfficiencyColor = (eff) => {
    if (eff > 75) return "#4ade80"; // Verde (Excelente)
    if (eff > 40) return "#fbbf24"; // Amarillo (Normal)
    return "#f87171"; // Rojo (Distraído)
  };

  const effColor = getEfficiencyColor(efficiency);

  return (
    <div style={{ marginBottom: "25px" }}>
      <label
        className="panel-label"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Daily Efficiency</span>
        <span style={{ color: effColor, fontWeight: "bold" }}>
          {efficiency}%
        </span>
      </label>

      {/* Barra de Progreso Visual */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "15px",
          position: "relative",
        }}
      >
        {/* Barra Total (Representa el 100% de la sesión, siempre llena visualmente como fondo) */}

        {/* Barra de Foco (Representa el % real) */}
        <div
          style={{
            width: `${efficiency}%`,
            height: "100%",
            background: effColor,
            transition: "width 0.5s ease",
            boxShadow: `0 0 10px ${effColor}80`,
          }}
        />
      </div>

      {/* Grid de Datos Numéricos */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        {/* Tarjeta: Tiempo en PC */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--input-border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              padding: "8px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
            }}
          >
            <Monitor size={16} color="var(--text-muted)" />
          </div>
          <div>
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              Session Time
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {format(sessionSeconds)}
            </span>
          </div>
        </div>

        {/* Tarjeta: Foco Real */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              padding: "8px",
              background: "rgba(56, 189, 248, 0.1)",
              borderRadius: "6px",
            }}
          >
            <Zap size={16} color="var(--accent-color)" />
          </div>
          <div>
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--accent-color)",
                display: "block",
                textTransform: "uppercase",
              }}
            >
              Real Focus
            </span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "var(--text-main)",
              }}
            >
              {format(focusSeconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

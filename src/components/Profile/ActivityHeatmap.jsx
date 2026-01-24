import React from "react";

export default function ActivityHeatmap({ history = [] }) {
  // Generamos los últimos 28 días (4 semanas) para el ejemplo
  const days = Array.from({ length: 28 }, (_, i) => {
    // Simulamos datos si no existen (para que veas cómo queda)
    const intensity = history[i] || Math.floor(Math.random() * 5);
    return { day: i, intensity };
  });

  const getColor = (intensity) => {
    if (intensity === 0) return "rgba(255,255,255,0.05)";
    if (intensity === 1) return "rgba(56, 189, 248, 0.2)";
    if (intensity === 2) return "rgba(56, 189, 248, 0.5)";
    if (intensity === 3) return "rgba(56, 189, 248, 0.8)";
    return "var(--accent-color)"; // Intensidad máxima
  };

  return (
    <div style={{ marginBottom: "25px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontSize: "0.75rem",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        <span>Activity Log</span>
        <span>Last 30 Days</span>
      </div>

      {/* Grid del Heatmap */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)", // 7 días por fila
          gap: "6px",
        }}
      >
        {days.map((d, i) => (
          <div
            key={i}
            title={`Day ${i + 1}: ${d.intensity} hours`} // Tooltip nativo simple
            style={{
              width: "100%",
              paddingTop: "100%", // Truco para mantener aspecto cuadrado 1:1
              background: getColor(d.intensity),
              borderRadius: "4px",
              position: "relative",
              cursor: "help",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "0.65rem",
          color: "#64748b",
          textAlign: "right",
        }}
      >
        less ■ ■ ■ ■ ■ more
      </div>
    </div>
  );
}

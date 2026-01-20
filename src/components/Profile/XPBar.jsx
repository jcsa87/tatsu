import React from "react";

export default function XPBar({ current, max, level }) {
  // Calculamos el porcentaje, limitándolo al 100% para que no se desborde
  const percentage = Math.min((current / max) * 100, 100);

  // Función auxiliar para formatear números grandes (ej: 1200 -> 1.2k)
  const formatNumber = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
        fontFamily: "monospace",
      }}
    >
      {/* Nivel a la izquierda */}
      <span
        style={{
          color: "var(--gold-xp)",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {level}
      </span>

      {/* Barra contenedora (Fondo gris transparente) */}
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Barra de relleno (Dorada) */}
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "var(--gold-xp)",
            boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Números a la derecha (ej: 300/1k) */}
      <span
        style={{
          color: "#94a3b8",
          fontSize: "0.8rem",
          minWidth: "80px",
          textAlign: "right",
        }}
      >
        {formatNumber(current)}/{formatNumber(max)}
      </span>
    </div>
  );
}

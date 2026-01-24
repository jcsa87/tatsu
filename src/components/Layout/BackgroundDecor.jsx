import React from "react";
import "./BackgroundDecor.css";

export default function BackgroundDecor({ mode }) {
  return (
    <div className="decor-layer">
      {/* 1. Luz Ambiental (La mantenemos porque da atmósfera) */}
      <div
        className={`ambient-orb ${mode === "focus" ? "focus-mode" : "endless-mode"}`}
      />

      {/* 2. Guías sutiles de los sidebars (NUEVO) */}
      <div className="sidebar-guide left" />
      <div className="sidebar-guide right" />
    </div>
  );
}

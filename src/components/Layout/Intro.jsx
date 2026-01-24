import React, { useEffect, useState } from "react";
import "./Intro.css";

export default function Intro({ onComplete }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 1. Iniciar la animación de salida (fade out) a los 2.5 segundos
    const timer1 = setTimeout(() => {
      setIsLeaving(true);
    }, 2500);

    // 2. Avisar a la App que termine (kill) a los 3.3 segundos
    const timer2 = setTimeout(() => {
      // Verificación de seguridad: si onComplete existe, ejecútalo
      if (onComplete) {
        onComplete();
      }
    }, 3300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); // El array vacío asegura que solo corra una vez

  // Un botón de seguridad invisible por si falla el timer:
  // Si haces click en la pantalla, la intro se salta.
  return (
    <div
      className={`intro-overlay ${isLeaving ? "leaving" : ""}`}
      onClick={onComplete}
      style={{ cursor: "pointer" }}
    >
      <div className="intro-content">
        <span className="intro-kanji">立つ</span>
        <span className="intro-sub">tatsu</span>
      </div>
    </div>
  );
}

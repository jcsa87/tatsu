import React from "react";
import "./VisualTimer.css"; // Crearemos este CSS específico abajo

export default function VisualTimer({
  time,
  duration,
  mode,
  style = "circle",
  numerals = "western",
}) {
  // --- LÓGICA DE PROGRESO ---
  let pct = 0;
  if (mode === "focus") {
    pct = Math.min(time / duration, 1);
  } else {
    pct = (time % 3600) / 3600;
  }

  // --- LÓGICA DE TEXTO (KANJI VS WESTERN) ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    const text = `${m}:${s}`;

    if (numerals === "kanji") {
      const kanjiMap = {
        0: "〇",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "七",
        8: "八",
        9: "九",
      };
      return text
        .split("")
        .map((char) => kanjiMap[char] || char)
        .join("");
    }
    return text;
  };

  // --- RENDERIZADO ---
  return (
    <div className={`timer-container ${style}`}>
      {/* OPCIÓN 1: ESTILO CÍRCULO */}
      {style === "circle" && (
        <svg className="progress-ring" width="300" height="300">
          <circle
            className="ring-bg"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="transparent"
            r="140"
            cx="150"
            cy="150"
          />
          <circle
            className="ring-fill"
            stroke="var(--accent-color)"
            strokeWidth="8"
            fill="transparent"
            r="140"
            cx="150"
            cy="150"
            style={{
              strokeDasharray: `${2 * Math.PI * 140}`,
              strokeDashoffset: 2 * Math.PI * 140 * (1 - pct),
            }}
          />
        </svg>
      )}

      {/* OPCIÓN 2: ESTILO LÍNEA */}
      {style === "line" && (
        <div className="linear-track">
          <div className="linear-fill" style={{ width: `${pct * 100}%` }} />
        </div>
      )}

      {/* TEXTO (El número que había desaparecido) */}
      <div
        className={`timer-display ${numerals === "kanji" ? "kanji-font" : ""}`}
      >
        {formatTime(time)}
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { Activity, X, Check } from "lucide-react";
import "./HealthNotification.css";

export default function HealthNotification({ intensity, onClose, exercise }) {
  // Auto-cierre para modo discreto y normal después de 10s
  useEffect(() => {
    if (intensity !== "urgent") {
      const timer = setTimeout(onClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [intensity, onClose]);

  // Renderizado según intensidad

  // 1. DISCRETO: Pequeña píldora al lado de las métricas
  if (intensity === "discreet") {
    return (
      <div className="health-toast discreet" onClick={onClose}>
        <div className="pulse-dot" />
        <span>Stretching time: {exercise.name}</span>
      </div>
    );
  }

  // 2. NORMAL: Tarjeta de notificación estándar
  if (intensity === "normal") {
    return (
      <div className="health-toast normal">
        <div className="toast-header">
          <Activity size={16} color="var(--accent-color)" />
          <span>Health Break</span>
          <button onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="toast-body">
          <strong>{exercise.name}</strong>
          <p>{exercise.benefit}</p>
        </div>
      </div>
    );
  }

  // 3. URGENTE: Overlay central (interrumpe visualmente)
  if (intensity === "urgent") {
    return (
      <div className="health-overlay-backdrop">
        <div className="health-modal-urgent">
          <Activity size={40} className="urgent-icon" />
          <h2>Time to Decompress</h2>
          <p>You've been sitting for too long.</p>

          <div className="exercise-card">
            <h3>{exercise.name}</h3>
            <span className="benefit">{exercise.benefit}</span>
          </div>

          <button className="done-btn" onClick={onClose}>
            <Check size={18} /> I'm back
          </button>
        </div>
      </div>
    );
  }

  return null;
}

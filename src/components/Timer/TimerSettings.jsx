import React, { useState, useEffect } from "react";
import HealthNotification from "../Health/HealthNotification";
import {
  X,
  Clock,
  Zap,
  Coffee,
  Circle,
  Minus,
  Globe,
  Type,
  Activity,
  Eye,
  Move,
  HeartPulse,
  Timer,
  Layers,
  Layout,
} from "lucide-react";
import "./TimerSettings.css";

// ... (EXERCISES_GUIDE y PREVIEW_EXERCISE se mantienen igual) ...
const EXERCISES_GUIDE = [
  {
    id: 1,
    name: "Neck Rolls",
    benefit: "Relieves cervical tension from looking down.",
    icon: <Activity size={16} />,
    category: "Mobility",
    duration: "30s",
    intensityLevel: 1,
  },
  {
    id: 2,
    name: "20-20-20 Rule",
    benefit: "Prevents digital eye strain. Look away every 20m.",
    icon: <Eye size={16} />,
    category: "Vision",
    duration: "20s",
    intensityLevel: 1,
  },
  {
    id: 3,
    name: "Shoulder Shrugs",
    benefit: "Relaxes trapezius muscles.",
    icon: <Move size={16} />,
    category: "Tension",
    duration: "45s",
    intensityLevel: 2,
  },
  {
    id: 4,
    name: "Wrist Flex",
    benefit: "Prevents carpal tunnel syndrome.",
    icon: <Activity size={16} />,
    category: "Mobility",
    duration: "60s",
    intensityLevel: 2,
  },
  {
    id: 5,
    name: "Lumbar Twist",
    benefit: "Decompresses lower spine.",
    icon: <Move size={16} />,
    category: "Tension",
    duration: "60s",
    intensityLevel: 3,
  },
  {
    id: 6,
    name: "Stand Up & Walk",
    benefit: "Resets blood circulation completely.",
    icon: <HeartPulse size={16} />,
    category: "Circulation",
    duration: "2m",
    intensityLevel: 3,
  },
];
const PREVIEW_EXERCISE = {
  name: "Preview Exercise",
  benefit: "This is an example of how the notification looks.",
};

export default function TimerSettings({
  isOpen,
  onClose,
  duration,
  onDurationChange,
  onApplyPreset,
  visuals,
  onVisualChange,
  healthConfig,
  onHealthConfigChange,
  // NUEVA PROP PARA MÉTRICAS
  showMetrics,
  onShowMetricsChange,
}) {
  if (!isOpen) return null;

  const [showGuide, setShowGuide] = useState(false);
  const [previewIntensity, setPreviewIntensity] = useState(null);

  useEffect(() => {
    if (previewIntensity) {
      const timer = setTimeout(() => setPreviewIntensity(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [previewIntensity]);

  const renderIntensityDots = (level) => (
    <div className="intensity-dots">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`dot ${i <= level ? "filled" : ""}`} />
      ))}
    </div>
  );

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Vision":
        return "#38bdf8";
      case "Mobility":
        return "#4ade80";
      case "Tension":
        return "#fbbf24";
      case "Circulation":
        return "#f87171";
      default:
        return "var(--text-muted)";
    }
  };

  const presets = [
    { id: "pomodoro", label: "Pomodoro", time: 25, icon: <Clock size={16} /> },
    { id: "short", label: "Quick", time: 15, icon: <Zap size={16} /> },
    { id: "long", label: "Deep", time: 90, icon: <Coffee size={16} /> },
  ];

  return (
    <div className="settings-overlay">
      {previewIntensity && (
        <div
          style={{
            position: "absolute",
            zIndex: 3000,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
          }}
        >
          <HealthNotification
            intensity={previewIntensity}
            exercise={PREVIEW_EXERCISE}
            onClose={() => setPreviewIntensity(null)}
          />
        </div>
      )}

      <div className="settings-modal">
        <div className="settings-header">
          <h3>Settings</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="settings-scroll-area">
          {/* --- SECCIÓN VISUALES --- */}
          <div className="settings-section">
            <label className="section-title">Visual Style</label>

            {/* Estilo del Timer */}
            <div className="toggles-row" style={{ marginBottom: "10px" }}>
              <button
                className={`toggle-btn ${visuals.style === "circle" ? "active" : ""}`}
                onClick={() => onVisualChange("style", "circle")}
              >
                <Circle size={14} /> Ring
              </button>
              <button
                className={`toggle-btn ${visuals.style === "line" ? "active" : ""}`}
                onClick={() => onVisualChange("style", "line")}
              >
                <Minus size={14} /> Line
              </button>
            </div>

            {/* Numeración */}
            <div className="toggles-row" style={{ marginBottom: "15px" }}>
              <button
                className={`toggle-btn ${visuals.numerals === "western" ? "active" : ""}`}
                onClick={() => onVisualChange("numerals", "western")}
              >
                <Type size={14} /> 12:30
              </button>
              <button
                className={`toggle-btn ${visuals.numerals === "kanji" ? "active" : ""}`}
                onClick={() => onVisualChange("numerals", "kanji")}
              >
                <Globe size={14} /> 一二:三〇
              </button>
            </div>

            {/* NUEVO: Toggle para Footer Metrics */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Layout size={16} color="var(--text-muted)" />
                <span
                  style={{ fontSize: "0.85rem", color: "var(--text-main)" }}
                >
                  Show Footer Metrics
                </span>
              </div>
              <button
                className={`toggle-btn small ${showMetrics ? "active" : ""}`}
                onClick={() => onShowMetricsChange(!showMetrics)}
                style={{
                  width: "auto",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  margin: 0,
                }}
              >
                {showMetrics ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* --- SECCIÓN HEALTH (Sin cambios mayores) --- */}
          <div className="settings-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <label className="section-title" style={{ margin: 0 }}>
                Health Reminders
              </label>
              <button
                className={`toggle-btn small ${healthConfig.enabled ? "active" : ""}`}
                onClick={() =>
                  onHealthConfigChange("enabled", !healthConfig.enabled)
                }
                style={{
                  width: "auto",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                }}
              >
                {healthConfig.enabled ? "ON" : "OFF"}
              </button>
            </div>

            {healthConfig.enabled && (
              <div className="health-options-container">
                <div style={{ marginBottom: "15px" }}>
                  <span className="sub-label">
                    Frequency: Every {healthConfig.interval}m
                  </span>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={healthConfig.interval}
                    onChange={(e) =>
                      onHealthConfigChange("interval", parseInt(e.target.value))
                    }
                    className="settings-slider"
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <span className="sub-label">
                    Notification Intensity (Click to preview)
                  </span>
                  <div className="toggles-row">
                    {["discreet", "normal", "urgent"].map((type) => (
                      <button
                        key={type}
                        className={`toggle-btn ${healthConfig.intensity === type ? "active" : ""}`}
                        onClick={() => {
                          onHealthConfigChange("intensity", type);
                          setPreviewIntensity(type);
                        }}
                        style={{
                          textTransform: "capitalize",
                          fontSize: "0.8rem",
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="health-guide-trigger"
                  onClick={() => setShowGuide(!showGuide)}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Layers size={14} color="var(--accent-color)" /> Therapeutic
                    Index
                  </span>
                  <span
                    style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                  >
                    {showGuide ? "Hide" : "View Library"}
                  </span>
                </div>

                {showGuide && (
                  <div className="health-guide-list">
                    {EXERCISES_GUIDE.map((ex) => {
                      const catColor = getCategoryColor(ex.category);
                      return (
                        <div key={ex.id} className="guide-card">
                          <div className="guide-card-header">
                            <div className="guide-main-info">
                              <div
                                className="guide-icon-badge"
                                style={{
                                  color: catColor,
                                  background: `${catColor}20`,
                                }}
                              >
                                {ex.icon}
                              </div>
                              <strong>{ex.name}</strong>
                            </div>
                            <div className="guide-meta">
                              <span
                                className="meta-badge"
                                style={{
                                  color: catColor,
                                  borderColor: `${catColor}40`,
                                }}
                              >
                                {ex.category}
                              </span>
                              <span className="meta-badge">
                                <Timer
                                  size={10}
                                  style={{ marginRight: "4px" }}
                                />{" "}
                                {ex.duration}
                              </span>
                            </div>
                          </div>
                          <p className="guide-benefit">{ex.benefit}</p>
                          <div className="guide-card-footer">
                            <span
                              style={{
                                fontSize: "0.65rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              Intensity:
                            </span>
                            {renderIntensityDots(ex.intensityLevel)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* --- SECCIÓN PRESETS (Sin cambios) --- */}
          <div className="settings-section">
            <label className="section-title">Focus Duration</label>
            <div className="presets-grid">
              {presets.map((p) => (
                <button
                  key={p.id}
                  className={`preset-card ${duration === p.time ? "active" : ""}`}
                  onClick={() => onApplyPreset(p.time)}
                >
                  <div className="preset-icon">{p.icon}</div>
                  <div className="preset-info">
                    <span className="preset-name">{p.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value))}
              className="settings-slider"
            />
            <div className="slider-labels">
              <span>5m</span>
              <span style={{ color: "var(--accent-color)" }}>
                {duration} min
              </span>
              <span>120m</span>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-backdrop" onClick={onClose} />
    </div>
  );
}

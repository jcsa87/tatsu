import React from "react";
import { Zap, Moon, Sun, Award } from "lucide-react";

export default function Badges() {
  const badges = [
    {
      icon: <Zap size={16} />,
      label: "Streak Master",
      active: true,
      color: "#fbbf24",
    },
    {
      icon: <Moon size={16} />,
      label: "Night Owl",
      active: true,
      color: "#818cf8",
    },
    {
      icon: <Sun size={16} />,
      label: "Early Bird",
      active: false,
      color: "#f472b6",
    },
    {
      icon: <Award size={16} />,
      label: "Top 1%",
      active: false,
      color: "#34d399",
    },
  ];

  return (
    <div style={{ marginBottom: "25px" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "10px",
        }}
      >
        Achievements
      </label>
      <div style={{ display: "flex", gap: "10px" }}>
        {badges.map((b, i) => (
          <div
            key={i}
            title={b.active ? b.label : "Locked"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: b.active ? `${b.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${b.active ? b.color : "rgba(255,255,255,0.1)"}`,
              color: b.active ? b.color : "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "help",
            }}
          >
            {b.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

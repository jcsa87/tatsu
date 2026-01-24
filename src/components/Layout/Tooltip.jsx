import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function Tooltip({ text }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        marginLeft: "6px",
        verticalAlign: "middle",
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <HelpCircle
        size={14}
        color="var(--text-muted)"
        style={{ cursor: "help" }}
      />

      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(-8px)",
            background: "var(--panel-bg)",
            border: "1px solid var(--input-border)",
            padding: "8px 12px",
            borderRadius: "6px",
            width: "200px",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--text-main)",
            zIndex: 100,
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          {text}
          {/* Pequeña flecha hacia abajo */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              marginLeft: "-5px",
              borderWidth: "5px",
              borderStyle: "solid",
              borderColor:
                "var(--input-border) transparent transparent transparent",
            }}
          />
        </div>
      )}
    </div>
  );
}

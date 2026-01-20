import { useState, useEffect } from "react";
import { User, Settings, BarChart2, Maximize } from "lucide-react";
import Sidebar from "./components/Layout/Sidebar";
import XPBar from "./components/Profile/XPBar";
import "./App.css";

function App() {
  // Estados para controlar la UI
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [timer, setTimer] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);

  // Datos del usuario (simulados por ahora, luego los conectamos a localStorage)
  const [user, setUser] = useState({
    name: "guest",
    joinDate: "2026-01-20",
    tier: 1,
    xp: 246,
    xpNext: 1000,
    bio: "",
  });

  // Lógica del timer (simplificada para el ejemplo)
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
        // Aquí iría la lógica de sumar XP
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="app-container">
      {/* --- HUD Superior --- */}
      <header
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 50,
        }}
      >
        {/* Botón Perfil Izquierda */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setLeftPanelOpen(true)}
            aria-label="Open Profile"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid #38bdf8",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} />
          </button>
          <div>
            <div style={{ fontWeight: "bold" }}>
              {user.name}{" "}
              <span style={{ color: "#38bdf8", fontSize: "0.8em" }}>
                TIER {user.tier}
              </span>
            </div>
          </div>
        </div>

        {/* Botones Derecha */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="icon-btn" aria-label="Fullscreen">
            <Maximize size={20} color="white" />
          </button>
          <button className="icon-btn" aria-label="Leaderboard">
            <BarChart2 size={20} color="white" />
          </button>
          <button
            className="icon-btn"
            aria-label="Settings"
            onClick={() => setRightPanelOpen(true)}
          >
            <Settings size={20} color="white" />
          </button>
        </div>
      </header>

      {/* --- Timer Central --- */}
      <main style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>
          <button className="mode-btn active">focus cycles</button>
          <button className="mode-btn">endless flow</button>
        </div>

        {/* Aquí iría el componente CircularTimer SVG completo */}
        <div
          style={{
            fontSize: "5rem",
            fontWeight: "200",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(timer)}
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          style={{
            marginTop: "20px",
            padding: "10px 40px",
            background: "transparent",
            border: "1px solid white",
            color: "white",
            borderRadius: "30px",
            fontSize: "1.2rem",
          }}
        >
          {isActive ? "pause" : "start focus"}
        </button>
      </main>

      {/* --- PANEL IZQUIERDO (Perfil) --- */}
      <Sidebar
        isOpen={leftPanelOpen}
        onClose={() => setLeftPanelOpen(false)}
        side="left"
        title="Profile"
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.1)",
              border: "2px solid #38bdf8",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={40} color="#38bdf8" />
          </div>
          <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{user.name}</h3>
          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            since {user.joinDate}
          </span>
        </div>

        {/* La Barra de XP estilo imagen */}
        <XPBar current={user.xp} max={user.xpNext} level={user.tier} />

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#94a3b8",
              fontSize: "0.75rem",
              marginBottom: "5px",
            }}
          >
            BIOGRAPHY
          </label>
          <textarea
            placeholder="Write something about yourself..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "white",
              padding: "10px",
              resize: "none",
              height: "80px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              color: "#94a3b8",
              fontSize: "0.75rem",
              marginBottom: "5px",
            }}
          >
            SOCIALS
          </label>
          <input
            type="text"
            placeholder="github.com/..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "white",
              padding: "8px",
              marginBottom: "10px",
            }}
          />
          <input
            type="text"
            placeholder="x.com/..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "white",
              padding: "8px",
            }}
          />
        </div>

        <button
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "12px",
            background: "#38bdf8",
            border: "none",
            borderRadius: "6px",
            color: "#0f172a",
            fontWeight: "bold",
          }}
        >
          + Add Friend
        </button>
      </Sidebar>

      {/* --- PANEL DERECHO (Ajustes) --- */}
      <Sidebar
        isOpen={rightPanelOpen}
        onClose={() => setRightPanelOpen(false)}
        side="right"
        title="Menu"
      >
        <p>Settings content here...</p>
      </Sidebar>
    </div>
  );
}

export default App;

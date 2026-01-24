import { useState, useEffect } from "react";
import {
  User,
  Settings,
  BarChart2,
  Maximize,
  Clock,
  Calendar,
  Zap,
  Settings2,
} from "lucide-react";
import useDailyStats from "./hooks/useDailyStats";
import Sidebar from "./components/Layout/Sidebar";
import Intro from "./components/Layout/Intro";
import BackgroundDecor from "./components/Layout/BackgroundDecor";
import Tooltip from "./components/Layout/Tooltip";
import DailyMetrics from "./components/Layout/DailyMetrics";
import XPBar from "./components/Profile/XPBar";
import ActivityHeatmap from "./components/Profile/ActivityHeatmap";
import Badges from "./components/Profile/Badges";
import EfficiencyWidget from "./components/Profile/EfficiencyWidget";
import VisualTimer from "./components/Timer/VisualTimer";
import TimerSettings from "./components/Timer/TimerSettings";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import HealthNotification from "./components/Health/HealthNotification";

import "./App.css";

const HEALTH_TIPS = [
  { name: "Neck Rolls", benefit: "Relieves cervical tension." },
  { name: "20-20-20 Rule", benefit: "Look 20ft away for 20s." },
  { name: "Shoulder Shrugs", benefit: "Relaxes trapezius muscles." },
  { name: "Stand Up", benefit: "Reset your blood circulation." },
  { name: "Wrist Flex", benefit: "Prevent carpal tunnel." },
];

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  const [mode, setMode] = useState("focus");
  const [focusDuration, setFocusDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [isHoveringStart, setIsHoveringStart] = useState(false);

  // NUEVO ESTADO: Visibilidad de métricas
  const [showMetrics, setShowMetrics] = useState(true);

  const [visuals, setVisuals] = useState({
    style: "circle",
    numerals: "western",
  });
  const [healthConfig, setHealthConfig] = useState({
    enabled: true,
    interval: 60,
    intensity: "normal",
  });
  const [activeHealthNotif, setActiveHealthNotif] = useState(null);

  const [user, setUser] = useState({
    name: "Juan Cruz",
    joinDate: "2026-01-20",
    tier: 12,
    xp: 8450,
    xpNext: 12000,
    bio: "Software Engineering Student. SQL & React Enthusiast. 🇦🇷",
    stats: {
      totalTime: "42h",
      sessions: 84,
      streak: 5,
      avgSession: "35m",
      peakHour: "22:00",
    },
    history: [
      1, 0, 3, 4, 2, 1, 0, 2, 3, 4, 1, 0, 0, 2, 4, 4, 1, 2, 3, 0, 1, 2, 3, 0, 4,
      1, 2, 3,
    ],
  });

  const dailyStats = useDailyStats(isActive);

  // Salud Logic
  useEffect(() => {
    if (!healthConfig.enabled) return;
    const sessionSecs = dailyStats.sessionSeconds;
    const intervalSecs = healthConfig.interval * 60;
    if (sessionSecs > 0 && sessionSecs % intervalSecs === 0) {
      const randomTip =
        HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
      setActiveHealthNotif(randomTip);
    }
  }, [dailyStats.sessionSeconds, healthConfig]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (mode === "focus") {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeElapsed((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setTimeLeft(focusDuration * 60);
    else setTimeElapsed(0);
  };

  const handleSettingsChange = (newDuration) => {
    setFocusDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsActive(false);
  };

  const handleVisualChange = (key, value) =>
    setVisuals((prev) => ({ ...prev, [key]: value }));
  const handleHealthConfigChange = (key, value) =>
    setHealthConfig((prev) => ({ ...prev, [key]: value }));

  const toggleTimer = () => setIsActive(!isActive);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen().catch(console.log);
    else document.exitFullscreen();
  };

  const currentXPPct = Math.min((user.xp / user.xpNext) * 100, 100);
  const potentialXP = mode === "focus" ? Math.floor(timeLeft / 60) : 0;
  const potentialXPPct = Math.min(
    (potentialXP / user.xpNext) * 100,
    100 - currentXPPct,
  );
  const displayTime = mode === "focus" ? timeLeft : timeElapsed;
  const totalDuration = focusDuration * 60;

  if (showIntro) return <Intro onComplete={() => setShowIntro(false)} />;

  return (
    <div className="app-container">
      <BackgroundDecor mode={mode} />

      <header>
        <div className="profile-group">
          <button className="avatar-btn" onClick={() => setLeftPanelOpen(true)}>
            <User size={22} />
          </button>
          <div className="profile-info">
            <span
              style={{ fontWeight: "600", fontSize: "1rem", lineHeight: "1.2" }}
            >
              {user.name}
            </span>
            <div className="tier-mini-wrapper">
              <div
                className="tier-mini-fill"
                style={{ width: `${currentXPPct}%` }}
              ></div>
              {isHoveringStart && !isActive && potentialXP > 0 && (
                <div
                  className="tier-mini-ghost"
                  style={{
                    width: `${potentialXPPct}%`,
                    left: `${currentXPPct}%`,
                  }}
                ></div>
              )}
              <div className="tier-tooltip">
                <strong>LEVEL {user.tier}</strong> {user.xp} / {user.xpNext} XP
                {isHoveringStart && !isActive && potentialXP > 0 && (
                  <span
                    style={{ display: "block", color: "var(--accent-color)" }}
                  >
                    (+{potentialXP} XP)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="icon-btn" onClick={toggleFullscreen}>
            <Maximize size={22} />
          </button>
          <button className="icon-btn" onClick={() => setLeaderboardOpen(true)}>
            <BarChart2 size={22} />
          </button>
          <button className="icon-btn" onClick={() => setRightPanelOpen(true)}>
            <Settings size={22} />
          </button>
        </div>
      </header>

      {activeHealthNotif && (
        <HealthNotification
          intensity={healthConfig.intensity}
          exercise={activeHealthNotif}
          onClose={() => setActiveHealthNotif(null)}
        />
      )}

      <main style={{ textAlign: "center", zIndex: 10, position: "relative" }}>
        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === "focus" ? "active" : ""}`}
            onClick={() => switchMode("focus")}
          >
            focus cycles
          </button>
          <Tooltip text="Earn XP per session." />
          <button
            className={`mode-btn ${mode === "endless" ? "active" : ""}`}
            onClick={() => switchMode("endless")}
          >
            endless flow
          </button>
          <Tooltip text="Track time freely." />
          <button
            className="settings-trigger"
            onClick={() => setShowTimerSettings(true)}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
            }}
          >
            <Settings2 size={18} />
          </button>
        </div>

        <VisualTimer
          time={displayTime}
          duration={totalDuration}
          mode={mode}
          style={visuals.style}
          numerals={visuals.numerals}
        />

        <button
          onClick={toggleTimer}
          className={`main-action-btn ${isActive ? "active" : ""}`}
          onMouseEnter={() => setIsHoveringStart(true)}
          onMouseLeave={() => setIsHoveringStart(false)}
        >
          {isActive ? "pause" : "start focus"}
        </button>
      </main>

      {/* RENDERIZADO CONDICIONAL DE MÉTRICAS */}
      {showMetrics && (
        <DailyMetrics
          sessionSeconds={dailyStats.sessionSeconds}
          focusSeconds={dailyStats.focusSeconds}
        />
      )}

      <TimerSettings
        isOpen={showTimerSettings}
        onClose={() => setShowTimerSettings(false)}
        duration={focusDuration}
        onDurationChange={handleSettingsChange}
        onApplyPreset={(time) => {
          handleSettingsChange(time);
          setShowTimerSettings(false);
        }}
        visuals={visuals}
        onVisualChange={handleVisualChange}
        healthConfig={healthConfig}
        onHealthConfigChange={handleHealthConfigChange}
        // Pasamos props de métricas
        showMetrics={showMetrics}
        onShowMetricsChange={setShowMetrics}
      />

      <Sidebar
        isOpen={leftPanelOpen}
        onClose={() => setLeftPanelOpen(false)}
        side="left"
        title="Profile"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(56, 189, 248, 0.1)",
              border: "2px solid var(--accent-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={35} color="var(--accent-color)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{user.name}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              since {user.joinDate}
            </span>
          </div>
        </div>
        <XPBar current={user.xp} max={user.xpNext} level={user.tier} />
        <EfficiencyWidget
          sessionSeconds={dailyStats.sessionSeconds}
          focusSeconds={dailyStats.focusSeconds}
        />
        <ActivityHeatmap history={user.history} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--input-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                marginBottom: "5px",
              }}
            >
              <Clock size={14} /> TOTAL TIME
            </div>
            <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
              {user.stats.totalTime}
            </span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--input-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-muted)",
                fontSize: "0.7rem",
                marginBottom: "5px",
              }}
            >
              <Zap size={14} /> STREAK
            </div>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "500",
                color: "var(--gold-xp)",
              }}
            >
              {user.stats.streak} days
            </span>
          </div>
        </div>
        <Badges />
        <div className="panel-section">
          <label className="panel-label">Biography</label>
          <textarea defaultValue={user.bio} />
        </div>
        <button className="panel-btn">+ Add Friend</button>
      </Sidebar>

      <Sidebar
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        side="right"
        title="Leaderboard"
      >
        <Leaderboard />
      </Sidebar>

      <Sidebar
        isOpen={rightPanelOpen}
        onClose={() => setRightPanelOpen(false)}
        side="right"
        title="Menu"
      >
        <div className="panel-section">
          <label className="panel-label">Global Settings</label>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            App v2.1
          </p>
        </div>
      </Sidebar>
    </div>
  );
}

export default App;

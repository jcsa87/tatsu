import React, { useState } from "react";
import { Trophy, ChevronUp, ChevronDown, Minus, Crown } from "lucide-react";
import "./Leaderboard.css";

// Datos Mock (Simulados)
const MOCK_DATA = [
  { id: 1, name: "AlexFlow", xp: 15240, rank: 1, trend: "same", avatar: "AF" },
  { id: 2, name: "SarahDev", xp: 14800, rank: 2, trend: "up", avatar: "SD" },
  { id: 3, name: "ZenMaster", xp: 12500, rank: 3, trend: "down", avatar: "ZM" },
  { id: 4, name: "CodeNinja", xp: 9200, rank: 4, trend: "up", avatar: "CN" },
  {
    id: 5,
    name: "Juan Cruz",
    xp: 8450,
    rank: 5,
    trend: "same",
    avatar: "JC",
    isMe: true,
  }, // TU USUARIO
  { id: 6, name: "PixelArt", xp: 7100, rank: 6, trend: "down", avatar: "PA" },
  { id: 7, name: "StudyBot", xp: 6500, rank: 7, trend: "up", avatar: "SB" },
  { id: 8, name: "FocusGuy", xp: 5000, rank: 8, trend: "same", avatar: "FG" },
];

export default function Leaderboard() {
  const [filter, setFilter] = useState("weekly"); // 'weekly' | 'allTime'

  const getTrendIcon = (trend) => {
    if (trend === "up")
      return <ChevronUp size={14} className="trend-icon trend-up" />;
    if (trend === "down")
      return <ChevronDown size={14} className="trend-icon trend-down" />;
    return <Minus size={14} className="trend-icon trend-same" />;
  };

  return (
    <div className="leaderboard-container">
      {/* 1. Cabecera de Liga */}
      <div className="league-header">
        <div className="league-name">
          <Crown size={16} /> Diamond League
        </div>
        <div className="league-timer">Resets in 2d 14h 30m</div>
      </div>

      {/* 2. Tabs de Filtro */}
      <div className="lb-tabs">
        <button
          className={`lb-tab ${filter === "weekly" ? "active" : ""}`}
          onClick={() => setFilter("weekly")}
        >
          Weekly
        </button>
        <button
          className={`lb-tab ${filter === "allTime" ? "active" : ""}`}
          onClick={() => setFilter("allTime")}
        >
          All Time
        </button>
      </div>

      {/* 3. Lista de Usuarios */}
      <div className="lb-list">
        {MOCK_DATA.map((user) => (
          <div
            key={user.id}
            className={`lb-row rank-${user.rank} ${user.isMe ? "is-me" : ""}`}
          >
            {/* Rango + Tendencia */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "30px",
              }}
            >
              <span className="lb-rank">{user.rank}</span>
              {getTrendIcon(user.trend)}
            </div>

            {/* Usuario */}
            <div className="lb-user">
              <div className="lb-avatar">
                {user.rank === 1 ? "👑" : user.avatar}
              </div>
              <span className="lb-name">
                {user.name}
                {user.isMe && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginLeft: "5px",
                    }}
                  >
                    (You)
                  </span>
                )}
              </span>
            </div>

            {/* XP */}
            <span className="lb-xp">
              {filter === "weekly" ? user.xp : user.xp * 12} XP
            </span>
          </div>
        ))}
      </div>

      {/* Mensaje motivacional al final */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        Top 3 get a special badge next week!
      </div>
    </div>
  );
}

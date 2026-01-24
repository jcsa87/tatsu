import { useState, useEffect } from "react";

export default function useDailyStats(isTimerActive) {
  // Inicializamos leyendo de localStorage o empezando en 0
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("tatsu-daily-stats");
    const today = new Date().toDateString(); // Clave única por día (ej: "Sat Jan 24 2026")

    if (saved) {
      const parsed = JSON.parse(saved);
      // Si los datos guardados son de hoy, los usamos. Si son de ayer, reseteamos a 0.
      if (parsed.date === today) {
        return parsed;
      }
    }
    // Datos por defecto para un nuevo día
    return { date: today, sessionSeconds: 0, focusSeconds: 0 };
  });

  useEffect(() => {
    // Este intervalo corre CADA SEGUNDO que la app está abierta
    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          // 1. Siempre sumamos tiempo de sesión (Tiempo en PC)
          sessionSeconds: prev.sessionSeconds + 1,
          // 2. Solo sumamos foco si el timer está activo
          focusSeconds: isTimerActive
            ? prev.focusSeconds + 1
            : prev.focusSeconds,
        };

        // Guardamos en cada tick (o podrías optimizar guardando menos seguido)
        localStorage.setItem("tatsu-daily-stats", JSON.stringify(newStats));
        return newStats;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  return stats;
}

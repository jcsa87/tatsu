/**
 * MODULE: Timer Engine
 * Handles the countdown logic.
 */
class TimerEngine {
  constructor(callbacks) {
    this.defaultDuration = 30 * 60;
    this.duration = this.defaultDuration;
    this.remaining = this.duration;
    this.timerId = null;
    this.isRunning = false;

    this.onTick = callbacks.onTick;
    this.onComplete = callbacks.onComplete;
  }

  setDuration(minutes) {
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.onTick(this.remaining);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timerId = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        this.onComplete();
        this.remaining = this.duration;
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
    this.isRunning = false;
  }

  toggle() {
    this.isRunning ? this.stop() : this.start();
    return this.isRunning;
  }
}

/**
 * MODULE: Language Manager (i18n)
 */
const LanguageManager = {
  current: "en",

  // The Dictionary
  strings: {
    en: {
      subtitle: "stretching reminder",
      "status-ready": "ready to focus",
      "status-active": "focus mode active",
      "status-paused": "paused",
      "status-finished": "stand up!",
      "btn-start": "start",
      "btn-stop": "stop",
      "label-min": "min",
      "settings-title": "settings",
      "lang-label": "language",
      "about-credit": "created by juan cruz",
      "notif-body": "rise. stretch. reset.",
    },
    es: {
      subtitle: "recordatorio de estiramiento",
      "status-ready": "listo para enfocar",
      "status-active": "modo concentración",
      "status-paused": "pausado",
      "status-finished": "¡de pie!",
      "btn-start": "iniciar",
      "btn-stop": "detener",
      "label-min": "min",
      "settings-title": "ajustes",
      "lang-label": "idioma",
      "about-credit": "creado por juan cruz",
      "notif-body": "levántate. estira. reinicia.",
    },
  },

  init() {
    const saved = localStorage.getItem("tatsu-lang");
    this.current = saved || "en";
    this.updateDOM();
    this.updateButtons();
  },

  setLanguage(lang) {
    this.current = lang;
    localStorage.setItem("tatsu-lang", lang);
    this.updateDOM();
    this.updateButtons();

    // Notify UI to refresh dynamic text (like buttons)
    UIManager.refreshDynamicText();
  },

  // Updates all static elements with [data-i18n]
  updateDOM() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (this.strings[this.current][key]) {
        el.innerText = this.strings[this.current][key];
      }
    });
  },

  // Highlights the active language button in settings
  updateButtons() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (btn.dataset.lang === this.current) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  // Helper for JS to get a specific string
  get(key) {
    return this.strings[this.current][key] || key;
  },
};

/**
 * MODULE: Settings & Theme Manager
 */
const SettingsManager = {
  overlay: document.getElementById("settings-overlay"),
  btnOpen: document.getElementById("settings-btn"),
  btnClose: document.getElementById("close-settings"),
  themeBtn: document.getElementById("theme-btn"),
  iconPath: document.querySelector(".theme-icon path"),

  // SVG Paths
  sunPath:
    "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",
  moonPath:
    "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",

  init() {
    // Theme Logic
    const savedTheme = localStorage.getItem("tatsu-theme");
    if (savedTheme === "light") this.enableLightMode();
    else document.documentElement.setAttribute("data-theme", "dark");

    this.bindEvents();
  },

  bindEvents() {
    // Toggle Theme
    this.themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      current === "light" ? this.enableDarkMode() : this.enableLightMode();
    });

    // Toggle Settings Overlay
    this.btnOpen.addEventListener("click", () =>
      this.overlay.classList.add("visible"),
    );
    this.btnClose.addEventListener("click", () =>
      this.overlay.classList.remove("visible"),
    );

    // Language Buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        LanguageManager.setLanguage(e.target.dataset.lang);
      });
    });
  },

  enableLightMode() {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("tatsu-theme", "light");
    this.iconPath.setAttribute("d", this.moonPath);
  },

  enableDarkMode() {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("tatsu-theme", "dark");
    this.iconPath.setAttribute("d", this.sunPath);
  },
};

/**
 * MODULE: UI Manager
 */
const UIManager = {
  elements: {
    intro: document.getElementById("intro-layer"),
    app: document.getElementById("app-layer"),
    display: document.getElementById("timer-display"),
    btn: document.getElementById("toggle-btn"),
    input: document.getElementById("duration-input"),
    status: document.getElementById("status-label"),
  },

  playIntro() {
    setTimeout(() => {
      this.elements.intro.style.opacity = "0";
      setTimeout(() => {
        this.elements.intro.style.display = "none";
        this.elements.app.style.display = "block";
        void this.elements.app.offsetWidth;
        this.elements.app.classList.add("visible");
      }, 1000);
    }, 2200);
  },

  updateTimeDisplay(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const formatted = `${m}:${s < 10 ? "0" : ""}${s}`;
    this.elements.display.innerText = formatted;
    document.title = `${formatted} - tatsu`;
  },

  // Called when timer state changes or language changes
  refreshDynamicText() {
    // We need to know if the app is running. We access TatsuApp directly or use a stored flag.
    // For simplicity, we check the 'active' class on the button.
    const isRunning = this.elements.btn.classList.contains("active");

    if (isRunning) {
      this.elements.btn.innerText = LanguageManager.get("btn-stop");
      this.elements.status.innerText = LanguageManager.get("status-active");
    } else {
      this.elements.btn.innerText = LanguageManager.get("btn-start");
      // Only reset status text if it's not "Stand Up!" (we don't want to overwrite the finish message immediately)
      // But for language switching, we want immediate feedback.
      if (
        this.elements.status.innerText !==
        LanguageManager.get("status-finished")
      ) {
        this.elements.status.innerText = LanguageManager.get("status-paused");
      }
    }
  },

  setRunningState(isRunning) {
    if (isRunning) {
      this.elements.btn.classList.add("active");
      this.elements.input.disabled = true;
    } else {
      this.elements.btn.classList.remove("active");
      this.elements.input.disabled = false;
    }
    this.refreshDynamicText();
  },

  playNotificationSound() {
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.frequency.setValueAtTime(523.25, audio.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audio.currentTime + 1.5);
  },

  triggerSystemNotification() {
    if (Notification.permission === "granted") {
      new Notification("tatsu 立つ", {
        body: LanguageManager.get("notif-body"),
        silent: true,
      });
    }
  },
};

/**
 * MODULE: Tatsu App Controller
 */
const TatsuApp = {
  engine: null,

  init() {
    // 1. Initialize Managers
    LanguageManager.init();
    SettingsManager.init();

    // 2. Initialize Engine
    this.engine = new TimerEngine({
      onTick: (seconds) => UIManager.updateTimeDisplay(seconds),
      onComplete: () => this.handleComplete(),
    });

    // 3. Bind Main App Events
    this.bindEvents();

    // 4. Permissions & Intro
    if (Notification.permission !== "granted") Notification.requestPermission();
    UIManager.playIntro();
  },

  bindEvents() {
    UIManager.elements.btn.addEventListener("click", () => {
      const isRunning = this.engine.toggle();
      UIManager.setRunningState(isRunning);
    });

    UIManager.elements.input.addEventListener("change", (e) => {
      this.engine.setDuration(e.target.value);
    });
  },

  handleComplete() {
    UIManager.setRunningState(false);
    // Force override the status text for the "Finished" state
    UIManager.elements.status.innerText =
      LanguageManager.get("status-finished");

    UIManager.playNotificationSound();
    UIManager.triggerSystemNotification();
  },
};

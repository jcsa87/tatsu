/**
 * MODULE: Timer Engine
 * Pure business logic. Zero DOM manipulation.
 */
class TimerEngine {
  constructor(callbacks) {
    this.defaultDuration = 30 * 60;
    this.duration = this.defaultDuration;
    this.remaining = this.duration;
    this.timerId = null;
    this.isRunning = false;

    // Callbacks allow the Engine to "talk" to the App without knowing about the UI
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
 * MODULE: UI Manager
 * Handles animations, text updates, and sounds.
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
    // Wait 2.2s then fade out intro
    setTimeout(() => {
      this.elements.intro.style.opacity = "0";

      // Wait for fade (1s) then show App
      setTimeout(() => {
        this.elements.intro.style.display = "none";
        this.elements.app.style.display = "block";

        // Force reflow for transition
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
    document.title = `${formatted} - Tatsu`;
  },

  setRunningState(isRunning) {
    if (isRunning) {
      this.elements.btn.innerText = "Stop";
      this.elements.btn.classList.add("active");
      this.elements.status.innerText = "Focus Mode Active";
      this.elements.input.disabled = true;
    } else {
      this.elements.btn.innerText = "Start";
      this.elements.btn.classList.remove("active");
      this.elements.status.innerText = "Paused";
      this.elements.input.disabled = false;
    }
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
      new Notification("Tatsu 立つ", {
        body: "Rise. Stretch. Reset.",
        silent: true,
      });
    }
  },
};

/**
 * MODULE: Tatsu App Controller
 * The entry point that initializes everything.
 */
const TatsuApp = {
  engine: null,

  init() {
    // 1. Initialize Engine
    this.engine = new TimerEngine({
      onTick: (seconds) => UIManager.updateTimeDisplay(seconds),
      onComplete: () => this.handleComplete(),
    });

    // 2. Setup Event Listeners
    this.bindEvents();

    // 3. Request Permissions
    if (Notification.permission !== "granted") Notification.requestPermission();

    // 4. Start the Show
    UIManager.playIntro();
  },

  bindEvents() {
    // Button Click
    UIManager.elements.btn.addEventListener("click", () => {
      const isRunning = this.engine.toggle();
      UIManager.setRunningState(isRunning);
    });

    // Input Change
    UIManager.elements.input.addEventListener("change", (e) => {
      this.engine.setDuration(e.target.value);
    });
  },

  handleComplete() {
    UIManager.setRunningState(false); // Stop UI
    UIManager.elements.status.innerText = "Stand Up!";
    UIManager.playNotificationSound();
    UIManager.triggerSystemNotification();
  },
};

/* ... (ProfileManager and TimerEngine remain unchanged) ... */
const ProfileManager = {
  data: { name: "guest", isGuest: true, tier: 1, fp: 0, fpToNext: 100 },
  init() {
    const s = localStorage.getItem("tatsu-profile");
    if (s) this.data = JSON.parse(s);
    else this.save();
  },
  register(name) {
    this.data.name = name;
    this.data.isGuest = false;
    this.save();
    UIManager.updateHUD(this.data);
  },
  addFP(n) {
    this.data.fp += n;
    this.checkTierUp();
    this.save();
    UIManager.updateHUD(this.data);
  },
  checkTierUp() {
    if (this.data.fp >= this.data.fpToNext) {
      this.data.fp -= this.data.fpToNext;
      this.data.tier++;
      this.data.fpToNext = Math.floor(this.data.fpToNext * 1.5);
    }
  },
  save() {
    localStorage.setItem("tatsu-profile", JSON.stringify(this.data));
  },
};

class TimerEngine {
  constructor(cb) {
    this.sec = 0;
    this.tId = null;
    this.isRunning = false;
    this.onTick = cb.onTick;
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tId = setInterval(() => {
      this.sec++;
      this.onTick(this.sec);
    }, 1000);
  }
  stop() {
    clearInterval(this.tId);
    this.isRunning = false;
  }
  toggle() {
    this.isRunning ? this.stop() : this.start();
    return this.isRunning;
  }
}

const UIManager = {
  els: {},
  circleC: 0,

  // SVG Paths for Icons
  iconExpand:
    "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
  iconCompress:
    "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z",

  initDOM() {
    this.els = {
      intro: document.getElementById("intro-layer"),
      app: document.getElementById("app-layer"),
      hud: document.getElementById("hud-layer"),
      saveBtn: document.getElementById("save-profile-btn"),
      timer: document.getElementById("timer-display"),
      btn: document.getElementById("toggle-btn"),
      cycleBtn: document.getElementById("reset-cycle-btn"),
      linearContainer: document.getElementById("linear-cycle-container"),
      cycleBar: document.getElementById("cycle-bar"),
      cyclePct: document.getElementById("cycle-percent"),
      timerWrapper: document.getElementById("timer-wrapper"),
      svgRing: document.querySelector(".progress-ring"),
      progressCircle: document.getElementById("circle-progress"),
      name: document.getElementById("user-name-display"),
      tier: document.getElementById("user-tier"),
      tierBar: document.getElementById("tier-bar"),

      // Fullscreen Elements
      fsBtn: document.getElementById("fullscreen-btn"),
      fsIconPath: document.querySelector("#fs-icon path"),

      sidePanel: document.getElementById("side-panel"),
      panelBackdrop: document.getElementById("panel-backdrop"),
      panelTitle: document.getElementById("panel-title"),
      views: document.querySelectorAll(".panel-view"),
    };

    this.circleC = 2 * Math.PI * 140;
    this.els.progressCircle.style.strokeDasharray = `${this.circleC} ${this.circleC}`;
    this.els.progressCircle.style.strokeDashoffset = this.circleC;

    const sStyle = localStorage.getItem("tatsu-style");
    this.setStyle(sStyle || "ring");
  },

  setStyle(style) {
    localStorage.setItem("tatsu-style", style);
    document.querySelectorAll(".style-btn").forEach((btn) => {
      if (btn.dataset.style === style) btn.classList.add("active");
      else btn.classList.remove("active");
    });
    if (style === "line") {
      this.els.timerWrapper.classList.remove("hidden");
      this.els.svgRing.style.display = "none";
      this.els.linearContainer.classList.remove("hidden");
    } else {
      this.els.timerWrapper.classList.remove("hidden");
      this.els.svgRing.style.display = "block";
      this.els.linearContainer.classList.add("hidden");
      if (style === "glow") this.els.svgRing.classList.add("glow");
      else this.els.svgRing.classList.remove("glow");
    }
  },

  updateTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    this.els.timer.innerText = `${h > 0 ? h + ":" : ""}${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  },

  updateHUD(data) {
    this.els.name.innerText = data.name;
    this.els.tier.innerText = data.tier;
    this.els.tierBar.style.width = `${Math.min((data.fp / data.fpToNext) * 100, 100)}%`;
    if (data.isGuest) this.els.saveBtn.classList.remove("hidden");
    else this.els.saveBtn.classList.add("hidden");
  },

  updateCycle(percentage) {
    this.els.cycleBar.style.width = `${percentage}%`;
    this.els.cyclePct.innerText = `${Math.floor(percentage)}%`;
    const offset = this.circleC - (percentage / 100) * this.circleC;
    this.els.progressCircle.style.strokeDashoffset = offset;

    if (percentage >= 100) {
      this.els.cycleBar.classList.add("complete");
      this.els.progressCircle.style.stroke = "var(--success-color)";
    } else {
      this.els.cycleBar.classList.remove("complete");
      this.els.progressCircle.style.stroke = "var(--accent-color)";
    }
  },

  showCycleComplete(visible) {
    if (visible) {
      this.els.cycleBtn.classList.remove("hidden");
      this.els.btn.innerText = "session paused";
    } else {
      this.els.cycleBtn.classList.add("hidden");
    }
  },

  revealApp() {
    setTimeout(() => {
      this.els.intro.style.opacity = "0";
      setTimeout(() => {
        this.els.intro.style.display = "none";
        this.els.hud.classList.add("visible"); // Force HUD visible
        this.els.app.classList.add("visible");
      }, 1000);
    }, 2200);
  },

  // --- FULLSCREEN LOGIC ---
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      this.els.fsIconPath.setAttribute("d", this.iconCompress);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.els.fsIconPath.setAttribute("d", this.iconExpand);
      }
    }
  },

  openSidePanel(viewId, title) {
    this.els.views.forEach((v) => v.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
    this.els.panelTitle.innerText = title;
    this.els.sidePanel.classList.add("open");
    this.els.panelBackdrop.classList.add("visible");
  },

  closeSidePanel() {
    this.els.sidePanel.classList.remove("open");
    this.els.panelBackdrop.classList.remove("visible");
  },
};

const TatsuApp = {
  engine: null,
  cycleDuration: 30 * 60,
  init() {
    if (localStorage.getItem("tatsu-theme") === "light")
      document.documentElement.setAttribute("data-theme", "light");
    UIManager.initDOM();
    ProfileManager.init();
    this.startApp();
    this.bindEvents();
  },
  startApp() {
    UIManager.updateHUD(ProfileManager.data);
    UIManager.revealApp();
    this.engine = new TimerEngine({ onTick: (s) => this.handleTick(s) });
    if (Notification.permission !== "granted") Notification.requestPermission();
  },
  bindEvents() {
    document.getElementById("toggle-btn").addEventListener("click", () => {
      const r = this.engine.toggle();
      const b = document.getElementById("toggle-btn");
      b.innerText = r ? "stop session" : "initiate session";
      b.classList.toggle("active", r);
    });
    document
      .getElementById("reset-cycle-btn")
      .addEventListener("click", () => this.resetCycle());

    // Fullscreen
    document
      .getElementById("fullscreen-btn")
      .addEventListener("click", () => UIManager.toggleFullscreen());

    // Sidebar
    document.getElementById("leaderboard-btn").addEventListener("click", () => {
      document.getElementById("lb-user-name").innerText =
        ProfileManager.data.name;
      UIManager.openSidePanel("view-leaderboard", "community");
    });
    document
      .getElementById("settings-btn")
      .addEventListener("click", () =>
        UIManager.openSidePanel("view-settings", "configuration"),
      );
    document
      .getElementById("save-profile-btn")
      .addEventListener("click", () =>
        UIManager.openSidePanel("view-profile", "save identity"),
      );

    document
      .getElementById("close-panel-btn")
      .addEventListener("click", () => UIManager.closeSidePanel());
    document
      .getElementById("panel-backdrop")
      .addEventListener("click", () => UIManager.closeSidePanel());

    document
      .getElementById("create-profile-btn")
      .addEventListener("click", () => {
        const n = document.getElementById("username-input").value.trim();
        if (n) {
          ProfileManager.register(n);
          UIManager.closeSidePanel();
        }
      });

    document
      .getElementById("theme-toggle-btn")
      .addEventListener("click", () => {
        const c = document.documentElement.getAttribute("data-theme");
        const n = c === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", n);
        localStorage.setItem("tatsu-theme", n);
      });

    document.querySelectorAll(".style-btn").forEach((b) => {
      b.addEventListener("click", (e) =>
        UIManager.setStyle(e.target.dataset.style),
      );
    });
  },
  handleTick(sec) {
    UIManager.updateTime(sec);
    if (sec > 0 && sec % 60 === 0) ProfileManager.addFP(1);
    const tC = sec % this.cycleDuration;
    let pct = (tC / this.cycleDuration) * 100;
    if (tC === 0 && sec > 0) pct = 100;
    UIManager.updateCycle(pct);
    if (pct >= 100 && this.engine.isRunning) {
      this.engine.stop();
      UIManager.showCycleComplete(true);
      new Notification("Cycle Complete", {
        body: "Flow cycle complete. Reset to bank +50 points.",
      });
    }
  },
  resetCycle() {
    ProfileManager.addFP(50);
    UIManager.showCycleComplete(false);
    UIManager.updateCycle(0);
    const b = document.getElementById("toggle-btn");
    b.innerText = "initiate session";
    b.classList.remove("active");
  },
};

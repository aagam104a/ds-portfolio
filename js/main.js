// ----------------------------
// 0–100% Loader (3–4 seconds)
// ----------------------------
(function initLoader() {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  const pctEl = document.getElementById("loaderPct");
  const fillEl = document.getElementById("loaderFill");

  if (!loader || !app || !pctEl || !fillEl) return;

  const durationMs = 3500; // 3.5s
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const pct = Math.round(eased * 100);

    pctEl.textContent = String(pct);
    fillEl.style.width = pct + "%";
    loader.querySelector(".loader-bar")?.setAttribute("aria-valuenow", String(pct));

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      document.body.classList.remove("is-loading");
      app.classList.remove("app-hidden");
      app.classList.add("app-visible");

      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.style.display = "none";
      }, 450);
    }
  }

  requestAnimationFrame(tick);
})();

// ----------------------------
// Gradient hover blob
// ----------------------------
(() => {
  const blob = document.createElement("div");
  blob.className = "gradient-blob";
  document.body.appendChild(blob);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let blobX = mouseX;
  let blobY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add("blob-active");
  });

  const speed = 0.08; // follow smoothness
  function animate() {
    blobX += (mouseX - blobX) * speed;
    blobY += (mouseY - blobY) * speed;
    blob.style.transform = `translate(${blobX}px, ${blobY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.addEventListener("mouseleave", () => {
    document.body.classList.remove("blob-active");
  });
})();

// ----------------------------
// Smooth/inertia scrolling (desktop only)
// ----------------------------
(() => {
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches;

  if (isTouch) return; // keep native scroll on mobile

  let current = window.scrollY;
  let target = window.scrollY;
  let running = false;

  const ease = 0.12;      // higher = snappier, lower = smoother
  const maxStep = 180;    // clamp aggressive wheels

  function clampTarget() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    target = Math.max(0, Math.min(target, max));
  }

  function onWheel(e) {
    // allow horizontal trackpad gestures etc
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();

    const delta = Math.max(-maxStep, Math.min(maxStep, e.deltaY));
    target += delta;
    clampTarget();

    if (!running) {
      running = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    current += (target - current) * ease;
    window.scrollTo(0, current);

    if (Math.abs(target - current) > 0.5) {
      requestAnimationFrame(update);
    } else {
      running = false;
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });

  window.addEventListener("resize", () => {
    clampTarget();
    current = window.scrollY;
  });
})();

// ----------------------------
// Navbar scroll effect
// ----------------------------
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (!navbar) return;
  if (currentScroll > 100) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

// ----------------------------
// Email copy functionality (only if #email exists)
// ----------------------------
const emailEl = document.getElementById("email");
if (emailEl) {
  emailEl.addEventListener("click", (e) => {
    e.preventDefault();
    const email = "aagam.mehta.dsc@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const original = emailEl.innerHTML;
      emailEl.innerHTML = "COPIED!";
      setTimeout(() => {
        emailEl.innerHTML = original;
      }, 2000);
    });
  });
}

// ----------------------------
// Smooth scroll (anchors only)
// ----------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ----------------------------
// Scroll reveal for work & projects
// ----------------------------
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll(".work-item, .project-card").forEach((el) => observer.observe(el));
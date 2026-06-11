/* ===== script.js — Scroll reveal, timeline rail, theme toggle ===== */

/* ---------- 1. Scroll-reveal observer ---------- */
const revealItems = document.querySelectorAll(
  ".section-heading, .hero-main, .stat-card, .skill-group, .project-card-link, .info-card, .contact-panel, .education-row, .publication-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    // Stagger only the items that enter the viewport at the same time
    const intersecting = entries.filter(entry => entry.isIntersecting);
    intersecting.forEach((entry, index) => {
      entry.target.style.transitionDelay = `${index * 60}ms`;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

/* ---------- 2. Timeline rail progress ---------- */
const timelineWrap = document.querySelector(".timeline-wrap");
const timelineRailColumn = document.querySelector(".timeline-rail-column");
const timelineProgress = document.querySelector(".timeline-rail-progress");
const timelineGlow = document.querySelector(".timeline-rail-glow");
const timelineItems = document.querySelectorAll(".timeline-item");

const updateTimelineRail = () => {
  if (!timelineWrap || !timelineRailColumn || !timelineProgress || !timelineGlow || timelineItems.length === 0) {
    return;
  }

  const wrapRect = timelineWrap.getBoundingClientRect();
  const railHeight = timelineRailColumn.offsetHeight;
  const viewportCenter = window.innerHeight * 0.5;
  const progressRaw = viewportCenter - wrapRect.top;
  const progress = Math.max(0, Math.min(progressRaw, railHeight));

  timelineProgress.style.height = `${progress}px`;
  timelineGlow.style.top = `${progress}px`;

  let activeItem = null;
  let closestDistance = Infinity;

  timelineItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    const revealPoint = window.innerHeight * 0.88;

    item.classList.remove("is-active");

    if (rect.top < revealPoint) {
      item.classList.add("visible");
    }

    if (distance < closestDistance) {
      closestDistance = distance;
      activeItem = item;
    }
  });

  if (activeItem) {
    activeItem.classList.add("is-active");
  }
};

timelineItems.forEach((item, index) => {
  item.classList.add("visible");
  item.style.transitionDelay = `${index * 120}ms`;
});

updateTimelineRail();
window.addEventListener("scroll", updateTimelineRail, { passive: true });
window.addEventListener("resize", updateTimelineRail);

/* ---------- 3. Timeline detail toggles ---------- */
const timelineToggles = document.querySelectorAll(".timeline-toggle");

timelineToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const detailsId = button.getAttribute("aria-controls");
    const details = detailsId ? document.getElementById(detailsId) : null;
    if (!details) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "See details" : "Show less";
    details.hidden = isOpen;

    requestAnimationFrame(updateTimelineRail);
    setTimeout(updateTimelineRail, 220);
  });
});

/* ---------- 4. Resume dropdown close on outside click ---------- */
const resumeMenus = document.querySelectorAll(".resume-menu");

document.addEventListener("click", (event) => {
  resumeMenus.forEach((menu) => {
    if (!menu.open) return;
    if (menu.contains(event.target)) return;
    menu.open = false;
  });
});

/* ---------- 5. Theme toggle ---------- */
const themeToggle = document.querySelector(".theme-toggle");

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  if (!themeToggle) return;

  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
};

applyTheme("light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.body.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
}

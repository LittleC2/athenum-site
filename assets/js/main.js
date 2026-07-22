document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initActiveLink();
  initCursor();
  initStarfield();
  initReveal();
});

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

function initActiveLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

/* Custom cursor: a small dot glued to the pointer plus a ring that eases
   toward it, growing over interactive elements. Skipped on touch devices. */
function initCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(dot, ring);
  document.body.classList.add("custom-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let visible = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (!visible) {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
  });

  window.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    visible = false;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactive = "a, button, input, textarea, select, .card, .service-block";
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("cursor-ring--active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("cursor-ring--active"));
  });
}

/* Faint starfield drifting behind the content, on the pure black background. */
function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars() {
    const count = Math.floor((width * height) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0015 + 0.0004,
      drift: Math.random() * 0.04 + 0.01,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#efefef";
    stars.forEach((s) => {
      const twinkle = reduceMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.25;
      ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduceMotion) {
        s.y -= s.drift * 0.06;
        if (s.y < -5) s.y = height + 5;
      }
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  createStars();
  window.addEventListener("resize", () => {
    resize();
    createStars();
  });

  requestAnimationFrame(draw);
  if (reduceMotion) draw(0);
}

/* Fade-and-rise reveal for content entering the viewport. */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

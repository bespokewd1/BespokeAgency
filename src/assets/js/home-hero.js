(() => {
  const video = document.querySelector(".bcm-hero-video");
  const poster = document.querySelector(".bcm-hero-poster");
  const control = document.querySelector(".bcm-hero-motion");
  if (!video || !poster || !control) return;

  const motion = window.matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
  const connection = navigator.connection;
  let loaded = false;
  let pausedByUser = false;

  function allowed() {
    return motion.matches && !connection?.saveData;
  }

  function showStatic() {
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    video.classList.remove("is-ready");
    control.hidden = true;
  }

  function update() {
    if (!loaded) return;
    if (!allowed()) {
      showStatic();
      return;
    }
    if (pausedByUser) {
      control.textContent = "Play background video";
      control.hidden = false;
      return;
    }
    if (!video.hasAttribute("src")) {
      video.muted = true;
      video.src = video.dataset.src;
    }
    video.play().catch(showStatic);
  }

  video.addEventListener("playing", () => {
    video.classList.add("is-ready");
    control.textContent = "Pause background video";
    control.hidden = false;
  });
  video.addEventListener("error", showStatic);
  control.addEventListener("click", () => {
    if (video.paused) {
      pausedByUser = false;
      update();
    } else {
      pausedByUser = true;
      video.pause();
      control.textContent = "Play background video";
    }
  });
  motion.addEventListener("change", update);
  connection?.addEventListener("change", update);

  async function start() {
    await poster.decode().catch(() => {});
    loaded = true;
    update();
  }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();

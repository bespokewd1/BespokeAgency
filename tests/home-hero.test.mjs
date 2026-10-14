import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
const source = await readFile(new URL("../src/assets/js/home-hero.js", import.meta.url), "utf8");
function setup({ desktop = true, saveData = false, rejectPlayback = false } = {}) {
  const handlers = new Map();
  const media = { matches: desktop, addEventListener(_, fn) { this.update = fn; } };
  const connection = { saveData, addEventListener(_, fn) { this.update = fn; } };
  const classes = new Set();
  let src = null;
  const video = {
    dataset: { src: "/assets/videos/bcm-hero-720p.mp4" }, paused: true, loads: 0, plays: 0,
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) },
    hasAttribute: () => src !== null, removeAttribute() { src = null; },
    set src(value) { src = value; }, get src() { return src; },
    pause() { this.paused = true; }, load() { this.loads++; },
    play() { this.plays++; if (rejectPlayback) return Promise.reject(new Error("blocked")); this.paused = false; handlers.get("playing")(); return Promise.resolve(); },
    addEventListener(name, fn) { handlers.set(name, fn); },
  };
  const control = { hidden: true, textContent: "Pause background video", addEventListener(_, fn) { this.click = fn; } };
  const poster = { decode: () => Promise.resolve() };
  let start;
  vm.runInNewContext(source, {
    document: { readyState: "loading", querySelector: (selector) => ({ ".bcm-hero-video": video, ".bcm-hero-poster": poster, ".bcm-hero-motion": control })[selector] },
    navigator: { connection }, window: { matchMedia: () => media, addEventListener(_, fn) { start = fn; } },
  });
  return { video, control, media, connection, classes, start: async () => { await start(); await Promise.resolve(); } };
}
test("mobile, reduced motion and Save-Data do not assign or request video", async () => {
  for (const options of [{ desktop: false }, { saveData: true }]) {
    const state = setup(options); await state.start();
    assert.equal(state.video.src, null); assert.equal(state.video.plays, 0); assert.equal(state.control.hidden, true);
  }
});
test("desktop waits for the load/decode step, then supports pause and resume", async () => {
  const state = setup(); assert.equal(state.video.src, null); await state.start();
  assert.equal(state.video.src, "/assets/videos/bcm-hero-720p.mp4");
  assert.equal(state.control.hidden, false); assert.ok(state.classes.has("is-ready"));
  state.control.click(); assert.equal(state.video.paused, true); assert.equal(state.control.textContent, "Play background video");
  state.control.click(); assert.equal(state.video.paused, false); assert.equal(state.control.textContent, "Pause background video");
});
test("motion preference changes stop and detach video and allow a later eligible viewport", async () => {
  const state = setup(); await state.start(); state.media.matches = false; state.media.update();
  assert.equal(state.video.src, null); assert.equal(state.video.paused, true); assert.equal(state.control.hidden, true);
  state.media.matches = true; state.media.update(); assert.equal(state.video.paused, false);
  state.connection.saveData = true; state.connection.update(); assert.equal(state.video.src, null);
});
test("manual pause survives viewport changes and blocked playback leaves the static image", async () => {
  const state = setup(); await state.start(); state.control.click();
  state.media.matches = false; state.media.update(); state.media.matches = true; state.media.update();
  assert.equal(state.video.src, null); assert.equal(state.control.hidden, false); assert.equal(state.control.textContent, "Play background video");
  state.media.matches = false; state.media.update(); assert.equal(state.control.hidden, true);
  state.media.matches = true; state.media.update();
  state.control.click(); assert.equal(state.video.paused, false);
  const blocked = setup({ rejectPlayback: true }); await blocked.start();
  assert.equal(blocked.video.src, null); assert.equal(blocked.control.hidden, true); assert.ok(!blocked.classes.has("is-ready"));
});

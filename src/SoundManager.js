// src/SoundManager.js
// Audio playback (SYSTEM layer).
//
// Responsibilities:
// - Load sound assets during preload() (via loadSound)
// - Play sounds by key (SFX/music)
// - Provide a simple abstraction so gameplay code never touches audio directly
//
// Non-goals:
// - Does NOT subscribe to EventBus directly (Game wires events → play())
// - Does NOT decide when events happen (WORLD logic emits events)
// - Does NOT manage UI

export class SoundManager {
  constructor() {
    this.sfx = {}; // one-shot SFX
    this.loops = {}; // looping tracks (music)
  }

  // Load a one-shot SFX
  load(name, path) {
    this.sfx[name] = loadSound(path);
  }

  // Load a looping track (music)
  loadLoop(name, path) {
    const s = loadSound(path);
    s.setLoop(true);
    this.loops[name] = s;
  }

  // Play a one-shot SFX (safe: does nothing if not loaded yet)
  play(name) {
    this.sfx[name]?.play();
  }

  // Start a looping track (only if not already playing)
  playLoop(name) {
    const s = this.loops[name];
    if (s && !s.isPlaying()) s.play();
  }

  // Stop a looping track
  stopLoop(name) {
    this.loops[name]?.stop();
  }
}

// src/DebugOverlay.js
// Debug overlay (VIEW tool, driven by SYSTEM events).
//
// Responsibilities:
// - Render debug info in screen-space (camera.off())
// - Toggle visibility via D key (wired in Game.js)
// - Toggle moon gravity via M key (wired in Game.js)
// - Toggle god mode via G key (wired in Game.js)
// - Log events from EventBus (including wildcard "*")
//
// Non-goals:
// - Does NOT change world state directly — exposes flags for Game/PlayerController to read
// - Does NOT own input polling (InputManager does)

export class DebugOverlay {
  constructor() {
    this.enabled = false;

    // --- Toggleable features ---
    this.moonGravity = false; // M key — sets world.gravity.y to 1.6 vs 10
    this.godMode = false; // G key — PlayerController skips damage when true

    this.lines = [];
    this.maxLines = 6;
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  toggleMoonGravity() {
    this.moonGravity = !this.moonGravity;
    // Apply immediately to p5play world gravity
    world.gravity.y = this.moonGravity ? 1.6 : 10;
  }

  toggleGodMode() {
    this.godMode = !this.godMode;
  }

  log(evt) {
    if (!evt) return;
    this.lines.unshift(evt.name);
    if (this.lines.length > this.maxLines) this.lines.length = this.maxLines;
  }

  draw({ game } = {}) {
    if (!this.enabled) return;

    camera.off();

    const lvl = game?.level || null;
    const playerCtrl = lvl?.playerCtrl || null;
    const sprite = playerCtrl?.sprite;

    // --- Gather stats ---
    const hp = playerCtrl?.player?.health ?? "?";
    const maxHp = playerCtrl?.player?.maxHealth ?? "?";
    const score = lvl?.score ?? 0;
    const px = sprite ? Math.round(sprite.x) : "?";
    const py = sprite ? Math.round(sprite.y) : "?";
    const vx = sprite ? sprite.vel.x.toFixed(1) : "?";
    const vy = sprite ? sprite.vel.y.toFixed(1) : "?";
    const fps = Math.round(frameRate());
    const frame = frameCount;
    const levelId = lvl?.id ?? game?.levelId ?? "?";
    const enemies = lvl?.boarSystem?.boars?.length ?? "?";
    const leaves = lvl?.leavesRemaining ?? "?";
    const dead = playerCtrl?.player?.dead ?? false;
    const won = lvl?.won ?? false;

    // --- Panel sizing ---
    const panelX = 6;
    const panelY = 6;
    const panelW = 220;
    const panelH = 188;

    // Background panel
    push();
    noStroke();
    fill(0, 0, 0, 170);
    rect(panelX, panelY, panelW, panelH, 6);
    pop();

    // Title bar
    push();
    noStroke();
    fill(80, 200, 120, 200);
    rect(panelX, panelY, panelW, 16, 6, 6, 0, 0);
    pop();

    push();
    fill(0);
    textSize(9);
    textStyle(BOLD);
    text("DEBUG  [D] toggle  [M] moon  [G] god", panelX + 6, panelY + 11);
    pop();

    // Stats
    push();
    textSize(9);
    textStyle(NORMAL);

    const col1 = panelX + 8;
    const col2 = panelX + 118;
    let y = panelY + 28;
    const step = 12;

    // Column 1
    fill(180, 220, 255);
    text("FPS", col1, y);
    fill(255);
    text(fps, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("Frame", col1, y);
    fill(255);
    text(frame, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("Level", col1, y);
    fill(255);
    text(levelId, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("HP", col1, y);
    fill(255);
    text(`${hp}/${maxHp}`, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("Score", col1, y);
    fill(255);
    text(score, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("Leaves", col1, y);
    fill(255);
    text(leaves, col1 + 52, y);
    y += step;
    fill(180, 220, 255);
    text("Enemies", col1, y);
    fill(255);
    text(enemies, col1 + 52, y);
    y += step;

    // Column 2 (reset y)
    y = panelY + 28;
    fill(180, 220, 255);
    text("Pos", col2, y);
    fill(255);
    text(`${px}, ${py}`, col2 + 36, y);
    y += step;
    fill(180, 220, 255);
    text("Vel", col2, y);
    fill(255);
    text(`${vx}, ${vy}`, col2 + 36, y);
    y += step;
    fill(180, 220, 255);
    text("Dead", col2, y);
    fill(dead ? color(255, 80, 80) : 255);
    text(dead, col2 + 36, y);
    y += step;
    fill(180, 220, 255);
    text("Won", col2, y);
    fill(won ? color(80, 255, 120) : 255);
    text(won, col2 + 36, y);
    y += step;

    // Toggle status
    y += 4;
    fill(this.moonGravity ? color(100, 200, 255) : color(120));
    text(`[M] Moon Grav: ${this.moonGravity ? "ON " : "OFF"}`, col2, y);
    y += step;
    fill(this.godMode ? color(255, 220, 80) : color(120));
    text(`[G] God Mode:  ${this.godMode ? "ON " : "OFF"}`, col2, y);

    pop();

    // Divider before event log
    push();
    stroke(80, 200, 120, 120);
    strokeWeight(1);
    line(panelX + 4, panelY + 116, panelX + panelW - 4, panelY + 116);
    pop();

    // Recent events
    push();
    textSize(8);
    fill(160, 255, 160, 180);
    text("Events:", panelX + 8, panelY + 127);
    fill(200, 255, 200, 160);
    let ey = panelY + 138;
    for (const line of this.lines) {
      text(line, panelX + 8, ey);
      ey += 9;
    }
    pop();

    camera.on();
  }
}

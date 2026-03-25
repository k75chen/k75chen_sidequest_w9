// src/InputManager.js
// Input boundary (SYSTEM layer).
//
// Responsibilities:
// - Read keyboard state each frame
// - Provide a stable input snapshot object (holds + presses)
// - Centralize key mapping so WORLD code never touches kb directly
//
// Contract (what Game/Player expect):
// - left/right: held booleans
// - jumpPressed/attackPressed: edge-triggered booleans (true for 1 frame)
// - restartPressed/debugTogglePressed: edge-triggered booleans (true for 1 frame)
// - moonGravityPressed: edge-triggered (true for 1 frame) — M key
// - godModePressed: edge-triggered (true for 1 frame) — G key

export class InputManager {
  constructor() {
    // previous frame DOWN states (for edge detection)
    this._prevDown = {
      jump: false,
      attack: false,
      restart: false,
      debugToggle: false,
      moonGravity: false, // NEW
      godMode: false, // NEW
    };

    // canonical snapshot (same object reused every frame)
    this._input = {
      // held
      left: false,
      right: false,

      // edge-triggered (true for 1 frame)
      jumpPressed: false,
      attackPressed: false,
      restartPressed: false,
      debugTogglePressed: false,
      moonGravityPressed: false, // NEW — M key
      godModePressed: false, // NEW — G key
    };
  }

  update() {
    // If kb isn't ready yet (rare during boot), keep a safe "all false" snapshot.
    if (typeof kb === "undefined" || !kb) {
      this._input.left = false;
      this._input.right = false;
      this._input.jumpPressed = false;
      this._input.attackPressed = false;
      this._input.restartPressed = false;
      this._input.debugTogglePressed = false;
      this._input.moonGravityPressed = false; // NEW
      this._input.godModePressed = false; // NEW
      return this._input;
    }

    // -----------------------
    // Holds
    // -----------------------
    const leftHeld = kb.pressing("a") || kb.pressing("left");
    const rightHeld = kb.pressing("d") || kb.pressing("right");

    // -----------------------
    // Down states (for edges)
    // -----------------------
    const jumpDown = kb.pressing("w") || kb.pressing("up");
    const attackDown = kb.pressing("space");
    const restartDown = kb.pressing("r");
    const debugToggleDown = kb.pressing("t");
    const moonGravityDown = kb.pressing("m"); // NEW
    const godModeDown = kb.pressing("g"); // NEW

    // -----------------------
    // Write snapshot
    // -----------------------
    this._input.left = leftHeld;
    this._input.right = rightHeld;

    this._input.jumpPressed = jumpDown && !this._prevDown.jump;
    this._input.attackPressed = attackDown && !this._prevDown.attack;
    this._input.restartPressed = restartDown && !this._prevDown.restart;
    this._input.debugTogglePressed =
      debugToggleDown && !this._prevDown.debugToggle;
    this._input.moonGravityPressed =
      moonGravityDown && !this._prevDown.moonGravity; // NEW
    this._input.godModePressed = godModeDown && !this._prevDown.godMode; // NEW

    // -----------------------
    // Store prev DOWN states
    // -----------------------
    this._prevDown.jump = jumpDown;
    this._prevDown.attack = attackDown;
    this._prevDown.restart = restartDown;
    this._prevDown.debugToggle = debugToggleDown;
    this._prevDown.moonGravity = moonGravityDown; // NEW
    this._prevDown.godMode = godModeDown; // NEW

    return this._input;
  }

  // Game.js expects: inputSnap = this.input.input;
  get input() {
    return this._input;
  }
}

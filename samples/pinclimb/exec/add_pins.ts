import { ticks, vec } from "../../lib/crisp-game-lib/main";

export const title = "";

export const description = `
`;

export const characters = [];

export const options = {};

/** @type {Vector[]} */
let pins;

// 'update()' is called every frame (60 times per second).
function update() {
  // 'ticks' counts the number of frames from the start of the game.
  if (!ticks) {
    // Initialize the game state here. (ticks === 0)
    // 'vec()' creates a 2d vector instance.
    pins = [vec(50, 0)];
  }
}

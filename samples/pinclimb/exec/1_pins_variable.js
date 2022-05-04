import {
  line,
  box,
  input,
  play,
  addScore,
  end,
  ticks,
  difficulty,
  remove,
  vec,
  rnd,
  ceil,
} from "../../lib/crisp-game-lib/main";

export const title = "";

export const description = `
`;

export const characters = [];

export const options = {};

/** @type {Vector[]} */
let pins;

export function update() {
  if (!ticks) {
    pins = [vec(50, 5)];
  }
  pins.forEach((p) => {
    box(p, 3);
  });
}

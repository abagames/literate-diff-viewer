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
let nextPinDist;

export function update() {
  if (!ticks) {
    pins = [vec(50, 0)];
    nextPinDist = 10;
  }
  let scr = 0.02;
  remove(pins, (p) => {
    box(p, 3);
    p.y += scr;
    return p.y > 102;
  });
  nextPinDist -= scr;
  while (nextPinDist < 0) {
    pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    nextPinDist += rnd(5, 15);
  }
}

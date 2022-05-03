title = "";

description = `
`;

characters = [];

options = {};

/** @type {Vector[]} */
let pins;
let nextPinDist;

function update() {
  if (!ticks) {
    pins = [vec(50, 0)];
    nextPinDist = 10;
  }
  let scr = 0.02;
  remove(pins, (p) => {
    p.y += scr;
    return p.y > 102;
  });
  nextPinDist -= scr;
  while (nextPinDist < 0) {
    pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    nextPinDist += rnd(5, 15);
  }
}

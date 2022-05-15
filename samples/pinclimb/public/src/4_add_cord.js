title = "";

description = `
`;

characters = [];

options = {};

/** @type {{angle: number, length: number, pin: Vector}} */
let cord;
/** @type {Vector[]} */
let pins;
let nextPinDist;
const cordLength = 7;

function update() {
  if (!ticks) {
    pins = [vec(50, 5)];
    nextPinDist = 5;
    cord = { angle: 0, length: cordLength, pin: pins[0] };
  }
  let scr = 0.02;
  let nextPin;
  remove(pins, (p) => {
    p.y += scr;
    box(p, 3);
    return p.y > 102;
  });
  nextPinDist -= scr;
  while (nextPinDist < 0) {
    pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    nextPinDist += rnd(5, 15);
  }
}
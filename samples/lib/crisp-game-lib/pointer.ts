import { Vector, VectorLike } from "./vector";
import { Random } from "./random";
import { isInRange } from "./util";
import { pauseSound, resumeSound } from "./main";

export const pos = new Vector();
export let isPressed = false;
export let isJustPressed = false;
export let isJustReleased = false;

type Options = {
  isDebugMode?: boolean;
  anchor?: Vector;
  padding?: Vector;
  onPointerDownOrUp?: Function;
};

let defaultOptions: Options = {
  isDebugMode: true, //false,
  anchor: new Vector(),
  padding: new Vector(),
  onPointerDownOrUp: undefined,
};
let screen: HTMLElement;
let pixelSize: Vector;
let options: Options;

const debugRandom = new Random();
const debugPos = new Vector();
const debugMoveVel = new Vector();
let debugIsDown = false;
let cursorPos = new Vector();
let isCursorPosChanged = true;
let screenPos = new Vector();
let isDown = false;
let isClicked = false;
let isReleased = false;
let isInitialized = false;

export function init(
  _screen: HTMLElement,
  _pixelSize: Vector,
  _options?: Options
) {
  isInDebugMode = false;
  options = { ...defaultOptions, ..._options };
  screen = _screen;
  pixelSize = new Vector(
    _pixelSize.x + options.padding.x * 2,
    _pixelSize.y + options.padding.y * 2
  );
  cursorPos.set(
    screen.offsetLeft + screen.clientWidth * (0.5 - options.anchor.x),
    screen.offsetTop + screen.clientWidth * (0.5 - options.anchor.y)
  );
  if (options.isDebugMode) {
    debugPos.set(
      screen.offsetLeft + screen.clientWidth * (0.5 - options.anchor.x),
      screen.offsetTop + screen.clientWidth * (0.5 - options.anchor.y)
    );
  }
  if (!isInitialized) {
    isInitialized = true;
    document.addEventListener("mousedown", (e) => {
      onDown(e.pageX, e.pageY);
    });
    document.addEventListener("touchstart", (e) => {
      onDown(e.touches[0].pageX, e.touches[0].pageY);
    });
    document.addEventListener("mousemove", (e) => {
      onMove(e.pageX, e.pageY);
    });
    document.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        onMove(e.touches[0].pageX, e.touches[0].pageY);
      },
      { passive: false }
    );
    document.addEventListener("mouseup", (e) => {
      onUp(e);
    });
    document.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        (e.target as any).click();
        onUp(e);
      },
      { passive: false }
    );
  }
}

let isInDebugMode = false;

export function update() {
  if (isCursorPosChanged) {
    calcPointerPos(cursorPos.x, cursorPos.y, screenPos);
    pos.set(screenPos);
    isCursorPosChanged = false;
  }
  if (
    options.isDebugMode &&
    !screenPos.isInRect(0, 0, pixelSize.x, pixelSize.y)
  ) {
    if (!isInDebugMode) {
      isInDebugMode = true;
      pauseSound();
    }
    updateDebug();
    pos.set(debugPos);
    isJustPressed = !isPressed && debugIsDown;
    isJustReleased = isPressed && !debugIsDown;
    isPressed = debugIsDown;
  } else {
    if (isInDebugMode) {
      isInDebugMode = false;
      resumeSound();
    }
    isJustPressed = !isPressed && isClicked;
    isJustReleased = isPressed && isReleased;
    isPressed = isDown;
  }
  isClicked = isReleased = false;
}

export function clearJustPressed() {
  isJustPressed = false;
  isPressed = true;
}

function calcPointerPos(x: number, y: number, v: Vector) {
  if (screen == null) {
    return;
  }
  const rect = screen.getBoundingClientRect();
  v.x = Math.round(
    ((x - rect.left - screen.offsetLeft - scrollX) / screen.clientWidth +
      options.anchor.x) *
      pixelSize.x -
      options.padding.x
  );
  v.y = Math.round(
    ((y - rect.top - screen.offsetTop - scrollY) / screen.clientHeight +
      options.anchor.y) *
      pixelSize.y -
      options.padding.y
  );
}

function updateDebug() {
  if (debugMoveVel.length > 0) {
    debugPos.add(debugMoveVel);
    if (
      !isInRange(debugPos.x, -pixelSize.x * 0.1, pixelSize.x * 1.1) &&
      debugPos.x * debugMoveVel.x > 0
    ) {
      debugMoveVel.x *= -1;
    }
    if (
      !isInRange(debugPos.y, -pixelSize.y * 0.1, pixelSize.y * 1.1) &&
      debugPos.y * debugMoveVel.y > 0
    ) {
      debugMoveVel.y *= -1;
    }
    if (debugRandom.get() < 0.05) {
      debugMoveVel.set(0);
    }
  } else {
    if (debugRandom.get() < 0.1) {
      debugMoveVel.set(0);
      debugMoveVel.addWithAngle(
        debugRandom.get(Math.PI * 2),
        (pixelSize.x + pixelSize.y) * debugRandom.get(0.01, 0.03)
      );
    }
  }
  if (debugRandom.get() < 0.05) {
    debugIsDown = !debugIsDown;
  }
}

function onDown(x: number, y: number) {
  cursorPos.set(x, y);
  isCursorPosChanged = true;
  isDown = isClicked = true;
  if (options.onPointerDownOrUp != null) {
    options.onPointerDownOrUp();
  }
}

function onMove(x: number, y: number) {
  cursorPos.set(x, y);
  isCursorPosChanged = true;
}

function onUp(e: Event) {
  isDown = false;
  isReleased = true;
  if (options.onPointerDownOrUp != null) {
    options.onPointerDownOrUp();
  }
}

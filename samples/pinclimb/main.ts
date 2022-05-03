import * as literateDiffViewer from "../../src/main";
import { init } from "../lib/crisp-game-lib/main";
import { setParentElement } from "../lib/crisp-game-lib/view";
import * as template from "./exec/0_template";
import * as pins_variable from "./exec/1_pins_variable";
import * as add_pins from "./exec/2_add_pins";
import * as remove_pins from "./exec/3_remove_pins";
import * as add_cord from "./exec/4_add_cord";
import * as draw_cord from "./exec/5_draw_cord";
import * as completed from "./exec/99_completed";

const srcToModule = {
  "0_template.js": template,
  "1_pins_variable.js": pins_variable,
  "2_add_pins.js": add_pins,
  "3_remove_pins.js": remove_pins,
  "4_add_cord.js": add_cord,
  "5_draw_cord.js": draw_cord,
  "99_completed.js": completed,
};

async function onLoad() {
  const diffViewer = await literateDiffViewer.init();
  (diffViewer.markdownDiv as any).addEventListener(
    "sourcechange",
    onSourceChange
  );
  const floatDiv = document.createElement("div");
  floatDiv.style.cssText = `
position: fixed;
left: 90%;
top: 80%;
transform: translate(-50%, -50%);
width: 35vmin;
height: 35vmin;
z-index: 1;
`;
  document.body.appendChild(floatDiv);
  setParentElement(floatDiv);
  initEmptyGame();
  literateDiffViewer.start();
}

function onSourceChange(e: CustomEvent) {
  const fileName = e.detail.currentFileName;
  if (fileName === "(none)") {
    initEmptyGame();
    return;
  }
  const m = srcToModule[fileName];
  if (m == null) {
    return;
  }
  init({
    update: m.update,
    title: m.title,
    description: m.description,
    characters: m.characters,
    options: m.options,
  });
}

function initEmptyGame() {
  init({
    update: () => {},
    title: "",
    description: "",
    characters: [],
    options: { isShowingScore: false },
  });
}

window.addEventListener("load", onLoad);

import * as literateDiffViewer from "../../src/main";
import { init } from "../lib/crisp-game-lib/main";
import { setParentElement } from "../lib/crisp-game-lib/view";
import * as template from "./exec/template";
import * as add_pins from "./exec/add_pins";
import * as completed from "./exec/completed";

const srcToModule = {
  "template.js": template,
  "add_pins.js": add_pins,
  "completed.js": completed,
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
}

function onSourceChange(e: CustomEvent) {
  const fileName = e.detail.currentFileName;
  if (fileName === "(none)") {
    initEmptyGame();
    return;
  }
  const m = srcToModule[fileName];
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

import * as literateDiffViewer from "../../src/main";
import { init } from "../lib/crisp-game-lib/main";
import { setParentElement } from "../lib/crisp-game-lib/view";

let srcToModule;
const executedSourceDirectory = "./exec/";
const execModules = (import.meta as any).globEager("./exec/*.js");

async function onLoad() {
  const diffViewer = await literateDiffViewer.init();
  srcToModule = {};
  for (let i = 0; i < diffViewer.sourceFileNameElements.length; i++) {
    const e = diffViewer.sourceFileNameElements[i];
    if (e.type === "silent") {
      continue;
    }
    srcToModule[e.fileName] =
      execModules[`${executedSourceDirectory}${e.fileName}`];
  }
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
  if (e.detail.type === "silent") {
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

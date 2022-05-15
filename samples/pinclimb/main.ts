import * as literateDiffViewer from "../../src/main";
import { init } from "../lib/crisp-game-lib/main";
import { setParentElement } from "../lib/crisp-game-lib/view";

let srcToModule;
const executedSourceDirectory = "./exec/";
const execModules = (import.meta as any).globEager("./exec/*.js");

async function onLoad() {
  const diffViewer = await literateDiffViewer.init({
    onSourceChange,
    storageKeyName: "pinclimb",
  });
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
left: 98%;
top: 98%;
transform: translate(-100%, -100%);
width: 35vmin;
height: 35vmin;
z-index: 1;
`;
  document.body.appendChild(floatDiv);
  setParentElement(floatDiv);
  initEmptyGame();
  literateDiffViewer.start();
}

function onSourceChange(e: literateDiffViewer.SourceChangeEvent) {
  const fileName = e.currentFileName;
  if (fileName === "(none)") {
    initEmptyGame();
    return;
  }
  if (e.type === "silent") {
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

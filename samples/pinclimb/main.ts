import * as literateDiffViewer from "../../src/main";
import { init } from "../lib/crisp-game-lib/main";
import { setParentElement } from "../lib/crisp-game-lib/view";

let srcToModule;
const executedSourceDirectory = "./exec/";
const execModules = (import.meta as any).globEager("./exec/*.js");

async function onLoad() {
  const diffViewer = await literateDiffViewer.init({
    onSourceChange,
    postProcessSource,
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

function postProcessSource(src: string): string {
  const ibi = src.indexOf("import ");
  const ies = `";`;
  const iei = src.indexOf(ies);
  src = removeFromTo(src, ibi, iei + ies.length).trim();
  const ecs = "export const ";
  for (;;) {
    const eci = src.indexOf(ecs);
    if (eci < 0) {
      break;
    }
    src = removeFromTo(src, eci, eci + ecs.length);
  }
  const efs = "export function";
  const es = "export ";
  for (;;) {
    const efi = src.indexOf(efs);
    if (efi < 0) {
      break;
    }
    src = removeFromTo(src, efi, efi + es.length);
  }
  return src;
}

function removeFromTo(str: string, from: number, to: number) {
  return str.substring(0, from) + str.substring(to);
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

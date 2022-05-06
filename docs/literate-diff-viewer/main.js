import * as literateDiffViewer from "./literateDiffViewer.es.js";

async function onLoad() {
  await literateDiffViewer.init();
  literateDiffViewer.start();
}

window.addEventListener("load", onLoad);

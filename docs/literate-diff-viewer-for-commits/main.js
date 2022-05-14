import * as literateDiffViewer from "./literateDiffViewer.es.js";

async function onLoad() {
  await literateDiffViewer.init({
    srcDirectoryName: "",
    isFetchingFromOtherHost: true,
  });
  literateDiffViewer.start();
}

window.addEventListener("load", onLoad);

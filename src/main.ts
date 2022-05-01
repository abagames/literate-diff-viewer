import { marked } from "marked";
import hljs from "highlight.js";
import * as Diff from "diff";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui-slim.js";
import "highlight.js/styles/github.css";
import "diff2html/bundles/css/diff2html.min.css";

type Options = {
  readmeFileName?: string;
  srcDirectoryName?: string;
};

const defaultOptions: Options = {
  readmeFileName: "./README.md",
  srcDirectoryName: "./src",
};

let options: Options;

export async function init(_options: Options = {}) {
  options = { ...defaultOptions, ..._options };
  await loadMarkdown(options.readmeFileName);
  addDiffView();
  onScroll();
  window.addEventListener("scroll", onScroll);
}

const sourceFileNameElements: {
  element: HTMLElement;
  fileName: string;
  srcText: string;
}[] = [];

let sourceIndex = -2;

async function loadMarkdown(fileName: string) {
  marked.setOptions({
    highlight: function (code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  });
  const markdownRes = await fetch(fileName);
  const markdown = await markdownRes.text();
  const html = marked.parse(markdown);
  const markedDiv = document.createElement("div");
  markedDiv.innerHTML = html;
  let elms = [];
  markedDiv.childNodes.forEach((e) => elms.push(e));
  const srcPrefix = "(src)";
  await Promise.all(
    elms.map(async (e) => {
      if (e.textContent.startsWith(srcPrefix)) {
        const he = e as HTMLElement;
        const fileName = he.textContent.substring(srcPrefix.length + 1).trim();
        he.textContent = "";
        const fetchedSrc = await fetch(
          `${options.srcDirectoryName}/${fileName}`
        );
        const srcText = await fetchedSrc.text();
        sourceFileNameElements.push({
          element: he,
          fileName,
          srcText,
        });
        return Promise.resolve();
      }
    })
  );
  document.body.appendChild(markedDiv);
}

let diffElement: HTMLDivElement;

function addDiffView() {
  diffElement = document.createElement("div");
  diffElement.style.cssText = `
position: fixed;
left: 75%;
top: 50%;
transform: translate(-50%, -50%);
width: 45%;
height: 100%;
overflow: hidden;
`;
  document.body.appendChild(diffElement);
}

function onScroll() {
  if (sourceFileNameElements.length === 0) {
    return;
  }
  let pi = sourceIndex;
  if (sourceIndex < 0) {
    const rect = sourceFileNameElements[0].element.getBoundingClientRect();
    sourceIndex = rect.bottom < innerHeight / 2 ? 0 : -1;
  } else {
    let iv = 0;
    for (;;) {
      if (sourceIndex < 0) {
        sourceIndex = -1;
        break;
      }
      if (sourceIndex >= sourceFileNameElements.length) {
        sourceIndex = sourceFileNameElements.length - 1;
        break;
      }
      const rect =
        sourceFileNameElements[sourceIndex].element.getBoundingClientRect();
      if (iv === 0) {
        iv = rect.bottom < innerHeight / 2 ? 1 : -1;
      }
      if (iv === -1) {
        if (rect.bottom < innerHeight / 2) {
          break;
        }
      } else {
        if (rect.bottom >= innerHeight / 2) {
          sourceIndex--;
          break;
        }
      }
      sourceIndex += iv;
    }
  }
  if (sourceIndex === pi) {
    return;
  }
  const src1 =
    sourceIndex <= 0 ? "" : sourceFileNameElements[sourceIndex - 1].srcText;
  const fileName1 =
    sourceIndex <= 0
      ? "(none)"
      : sourceFileNameElements[sourceIndex - 1].fileName;
  const src2 =
    sourceIndex < 0 ? "" : sourceFileNameElements[sourceIndex].srcText;
  const fileName2 =
    sourceIndex < 0 ? "(none)" : sourceFileNameElements[sourceIndex].fileName;
  const diff = Diff.createTwoFilesPatch(fileName1, fileName2, src1, src2);
  const diff2htmlUi = new Diff2HtmlUI(diffElement, diff, {
    drawFileList: false,
    fileListToggle: false,
    fileContentToggle: false,
  });
  diff2htmlUi.draw();
  const elms = document.getElementsByClassName("d2h-file-diff");
  for (let i = 0; i < elms.length; i++) {
    const e = elms.item(i) as HTMLElement;
    e.style.overflow = "hidden";
  }
}

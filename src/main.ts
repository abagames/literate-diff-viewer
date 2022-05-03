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
let markdownDiv: HTMLDivElement;
const scrollStorageKey = "scroll_position_y";

export async function init(
  _options: Options = {}
): Promise<{ markdownDiv: HTMLDivElement }> {
  options = { ...defaultOptions, ..._options };
  const urlParams = new URLSearchParams(window.location.search);
  let readmeFileName = options.readmeFileName;
  if (urlParams.has("lang")) {
    const lang = urlParams.get("lang");
    let si = readmeFileName.lastIndexOf("/");
    si = si < 0 ? 0 : si;
    const dotIndex = readmeFileName.indexOf(".", si);
    if (dotIndex < 0) {
      readmeFileName += `_${lang}`;
    } else {
      readmeFileName = `${readmeFileName.substring(
        0,
        dotIndex
      )}_${lang}${readmeFileName.substring(dotIndex)}`;
    }
  }
  await loadMarkdown(readmeFileName);
  addDiffView();
  const sy = Number.parseInt(sessionStorage.getItem(scrollStorageKey)) || 0;
  window.scrollTo(0, sy);
  window.addEventListener("scroll", onScroll);
  window.addEventListener("beforeunload", onBeforeUnload);
  return { markdownDiv };
}

export function start() {
  onScroll();
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
  markdownDiv = document.createElement("div");
  markdownDiv.style.paddingLeft = "3%";
  markdownDiv.style.width = "47%";
  markdownDiv.innerHTML = html;
  const srcPrefix = "(src)";
  const srcHidePrefix = "(src_hide)";
  const cns = markdownDiv.childNodes;
  for (let i = 0; i < cns.length; i++) {
    const e = cns.item(i);
    const tc = e.textContent;
    if (tc.startsWith(srcPrefix) || tc.startsWith(srcHidePrefix)) {
      const he = e as HTMLElement;
      const pl = (tc.startsWith(srcPrefix) ? srcPrefix : srcHidePrefix).length;
      const fileName = he.textContent.substring(pl + 1).trim();
      if (tc.startsWith(srcHidePrefix)) {
        he.textContent = "";
      }
      const fetchedSrc = await fetch(`${options.srcDirectoryName}/${fileName}`);
      const srcText = await fetchedSrc.text();
      sourceFileNameElements.push({
        element: he,
        fileName,
        srcText,
      });
    }
  }
  document.body.appendChild(markdownDiv);
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
  const oldSrc =
    sourceIndex <= 0 ? "" : sourceFileNameElements[sourceIndex - 1].srcText;
  const oldFileName =
    sourceIndex <= 0
      ? "(none)"
      : sourceFileNameElements[sourceIndex - 1].fileName;
  const currentSrc =
    sourceIndex < 0 ? "" : sourceFileNameElements[sourceIndex].srcText;
  const currentFileName =
    sourceIndex < 0 ? "(none)" : sourceFileNameElements[sourceIndex].fileName;
  const diff = Diff.createTwoFilesPatch(
    oldFileName,
    currentFileName,
    oldSrc,
    currentSrc
  );
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
  const ce = new CustomEvent("sourcechange", {
    detail: { oldFileName, currentFileName },
  });
  markdownDiv.dispatchEvent(ce);
}

function onBeforeUnload() {
  sessionStorage.setItem(scrollStorageKey, `${window.scrollY}`);
}

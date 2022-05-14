import { marked } from "marked";
import hljs from "highlight.js";
import * as Diff from "diff";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui-slim.js";
import "highlight.js/styles/github.css";
import "diff2html/bundles/css/diff2html.min.css";

export type SrcType = "show" | "hide" | "silent";

export type SourceChangeEvent = {
  oldFileName: string;
  currentFileName: string;
  type: SrcType;
};

export type Options = {
  readmeFileName?: string;
  srcDirectoryName?: string;
  isFetchingFromOtherHost?: boolean;
  onSourceChange?: (event: SourceChangeEvent) => void;
  postProcessSource?: (src: string) => string;
  storageKeyName?: string;
};

const defaultOptions: Options = {
  readmeFileName: "./README.md",
  srcDirectoryName: "./src/",
  isFetchingFromOtherHost: false,
};

let options: Options;
let markdownDiv: HTMLDivElement;
let scrollStorageKey = "scroll_position_y";

const srcPrefixes = {
  show: "",
  hide: "_hide",
  silent: "_silent",
};

export type SourceFileNameElement = {
  element: HTMLElement;
  fileName: string;
  srcText: string;
  type: SrcType;
};

const sourceFileNameElements: SourceFileNameElement[] = [];

let sourceIndex = -2;

export async function init(_options: Options = {}): Promise<{
  markdownDiv: HTMLDivElement;
  sourceFileNameElements: SourceFileNameElement[];
}> {
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
  if (options.storageKeyName != null) {
    scrollStorageKey += `_${options.storageKeyName}`;
  }
  const sy = Number.parseInt(sessionStorage.getItem(scrollStorageKey)) || 0;
  window.scrollTo(0, sy);
  window.addEventListener("scroll", onScroll);
  window.addEventListener("beforeunload", onBeforeUnload);
  return {
    markdownDiv,
    sourceFileNameElements,
  };
}

export function start() {
  onScroll();
}

async function loadMarkdown(fileName: string) {
  const style = document.createElement("style");
  style.innerText = `
pre, code { background: #eee; }
code { padding: 2px; }
pre { padding: 10px; }
`;
  document.head.appendChild(style);
  marked.setOptions({
    highlight: function (code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  });
  const loadingMessage = document.createElement("p");
  loadingMessage.innerText = "Loading...";
  document.body.appendChild(loadingMessage);
  const markdownRes = await fetch(fileName);
  const markdown = await markdownRes.text();
  const html = marked.parse(markdown);
  markdownDiv = document.createElement("div");
  markdownDiv.style.paddingLeft = "3%";
  markdownDiv.style.width = "45%";
  markdownDiv.innerHTML = html;
  const cns = markdownDiv.childNodes;
  for (let i = 0; i < cns.length; i++) {
    const e = cns.item(i);
    const tc = e.textContent;
    for (let type in srcPrefixes) {
      const prefix = `(src${srcPrefixes[type]})`;
      if (tc.startsWith(prefix)) {
        const he = e as HTMLElement;
        const fileName = he.textContent.substring(prefix.length + 1).trim();
        if (type !== "show") {
          he.textContent = "";
        } else if (options.isFetchingFromOtherHost) {
          const si = fileName.lastIndexOf("/");
          if (si >= 0) {
            he.childNodes.forEach((c) => {
              c.textContent = c.textContent.replaceAll(
                fileName,
                fileName.substring(si + 1)
              );
            });
          }
        }
        sourceFileNameElements.push({
          element: he,
          fileName,
          srcText: "",
          type: type as SrcType,
        });
      }
    }
  }
  await Promise.all(
    sourceFileNameElements.map(async (e) => {
      const fetchedSrc = await fetch(
        `${options.srcDirectoryName}${
          options.srcDirectoryName.endsWith("/") ||
          options.srcDirectoryName.length === 0
            ? ""
            : "/"
        }${e.fileName}`
      );
      let srcText = await fetchedSrc.text();
      if (options.postProcessSource != null) {
        srcText = options.postProcessSource(srcText);
      }
      e.srcText = srcText;
      if (options.isFetchingFromOtherHost) {
        const si = e.fileName.lastIndexOf("/");
        e.fileName = e.fileName.substring(si + 1);
      }
      return 0;
    })
  );
  document.body.removeChild(loadingMessage);
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
width: 50%;
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
  const type: SrcType =
    sourceIndex < 0 ? "hide" : sourceFileNameElements[sourceIndex].type;
  if (type !== "silent") {
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
    const diffElms = document.getElementsByClassName("d2h-file-diff");
    for (let i = 0; i < diffElms.length; i++) {
      const e = diffElms.item(i) as HTMLElement;
      e.style.overflow = "hidden";
    }
    const tableElms = document.getElementsByClassName("d2h-diff-table");
    for (let i = 0; i < tableElms.length; i++) {
      const e = tableElms.item(i) as HTMLElement;
      e.style.fontSize = "12px";
    }
  }
  if (options.onSourceChange != null) {
    options.onSourceChange({ oldFileName, currentFileName, type });
  }
}

function onBeforeUnload() {
  sessionStorage.setItem(scrollStorageKey, `${window.scrollY}`);
}

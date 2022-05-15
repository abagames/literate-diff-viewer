const fs = require("fs");

const title = "pinclimb";
const markdownFileName = `./samples/${title}/public/README.md`;
const readingDirectoryName = `./samples/${title}/public/src/`;
const writingDirectoryName = `./samples/${title}/exec/`;

const importPrefix = `import {
  line,
  box,
  input,
  play,
  addScore,
  end,
  ticks,
  difficulty,
  remove,
  vec,
  rnd,
  ceil,
} from "../../lib/crisp-game-lib/main";

`;

function listSrcFileNames() {
  const markdownText = fs.readFileSync(markdownFileName, "utf-8");
  const srcFileNames = [];
  markdownText.split("\n").forEach((l) => {
    if (l.startsWith("(src")) {
      const cb = l.indexOf(")");
      let fn = l.substring(cb + 1).trim();
      const bb = fn.indexOf("[");
      if (bb >= 0) {
        fn = fn.substring(bb + 1, fn.indexOf("]"));
      }
      srcFileNames.push(fn);
    }
  });
  return srcFileNames;
}

function convert(fileName) {
  const src = fs.readFileSync(`${readingDirectoryName}${fileName}`, "utf-8");
  //return removeExport(src);
  return `${importPrefix}${addExport(src)}\n`;
}

function removeExport(src) {
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

function addExport(src) {
  let ns = src;
  ["title", "description", "characters", "options", "function update"].forEach(
    (kw) => {
      const ki = ns.indexOf(kw);
      if (ki < 0) {
        return;
      }
      ns = `${ns.substring(0, ki)}${
        kw === "function update" ? "export " : "export const "
      }${ns.substring(ki)}`;
    }
  );
  return ns;
}

function removeFromTo(str, from, to) {
  return str.substring(0, from) + str.substring(to);
}

const srcFileNames = listSrcFileNames();
srcFileNames.forEach((fn) => {
  const src = convert(fn);
  //fs.writeFileSync(`${writingDirectoryName}${fn}`, src, "utf-8");
});

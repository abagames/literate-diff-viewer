# literate-diff-viewer ([DEMO](https://abagames.github.io/literate-diff-viewer/pinclimb/))

Show source code description with literate diff way.

<img src="./docs/screenshot.png" alt="screenshot"/>

### How to use literate-diff-viewer

See [How to use literate-diff-viewer](https://abagames.github.io/literate-diff-viewer/literate-diff-viewer/).

### Reference

```ts
type SrcType = "show" | "hide" | "silent";

type SourceChangeEvent = {
  oldFileName: string;
  currentFileName: string;
  type: SrcType;
};

type Options = {
  readmeFileName?: string; // default: "./README.md"
  srcDirectoryName?: string; // default:  "./src"
  onSourceChange?: (event: SourceChangeEvent) => void;
  postProcessSource?: (src: string) => string;
  storageKeyName?: string;
};

type SourceFileNameElement = {
  element: HTMLElement;
  fileName: string;
  srcText: string;
  type: SrcType;
};

async function init(_options: Options = {}): Promise<{
  markdownDiv: HTMLDivElement;
  sourceFileNameElements: SourceFileNameElement[];
}>;

function start();
```

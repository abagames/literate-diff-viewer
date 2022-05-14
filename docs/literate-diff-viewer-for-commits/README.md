## How to use literate-diff-viewer for a committed source code file on GitHub

This article explains how to use literate-diff-viewer with a committed file on GitHub.

### Placing files

Place the files on your web server (or GitHub pages) as follows.

```
(root directory)
|- literateDiffViewer.es.js
|- style.css
|- index.html
|- main.js
|- README.md
```

For `literateDiffViewer.es.js`, `style.css` `index.html` and `main.js`, use the files in [this directory](https://github.com/abagames/literate-diff-viewer/tree/master/docs/literate-diff-viewer-for-commits).

### Commit source code

Commit a source code file to any repository. Commit with appropriate timing when you want to add the explanation to the current code.

### Write README.md

Write a description of the source code in `README.md`.

### Refer to source code of specific commit from README.md

You can refer to the committed source code by writing the following text in the README.md

```
 (src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 761516c730d589f9515f5dbff1cb7969de6c8ca6/
 samples/committed_src/matchall.js]
 (https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 761516c730d589f9515f5dbff1cb7969de6c8ca6/
 samples/committed_src/matchall.js)
```

(src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/761516c730d589f9515f5dbff1cb7969de6c8ca6/samples/committed_src/matchall.js](https://raw.githubusercontent.com/abagames/literate-diff-viewer/761516c730d589f9515f5dbff1cb7969de6c8ca6/samples/committed_src/matchall.js)

Use `raw.githubusercontent.com` to refer to the source code committed to Github.

<br><br><br><br><br>

You can refer to another commit by changing the commit hash (e.g. `40d1cbf721306a34dba42905f01373c16216483a`) in the URL.

```
 (src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 40d1cbf721306a34dba42905f01373c16216483a/
 samples/committed_src/matchall.js]
 (https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 40d1cbf721306a34dba42905f01373c16216483a/
 samples/committed_src/matchall.js)
```

(src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/40d1cbf721306a34dba42905f01373c16216483a/samples/committed_src/matchall.js](https://raw.githubusercontent.com/abagames/literate-diff-viewer/40d1cbf721306a34dba42905f01373c16216483a/samples/committed_src/matchall.js)

Diff between these commits is displayed on the right side of the screen.

<br><br><br><br><br>

```
 (src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 27754231095c617ddfaa8b4f1fb21ce1667dbe6c/
 samples/committed_src/matchall.js]
 (https://raw.githubusercontent.com/abagames/literate-diff-viewer/
 27754231095c617ddfaa8b4f1fb21ce1667dbe6c/
 samples/committed_src/matchall.js)
```

(src) [https://raw.githubusercontent.com/abagames/literate-diff-viewer/27754231095c617ddfaa8b4f1fb21ce1667dbe6c/samples/committed_src/matchall.js](https://raw.githubusercontent.com/abagames/literate-diff-viewer/27754231095c617ddfaa8b4f1fb21ce1667dbe6c/samples/committed_src/matchall.js)

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

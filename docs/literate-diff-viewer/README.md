## How to use literate-diff-viewer

This article explains how to use literate-diff-viewer.

### Placing files

Place the files as follows.

```
(root directory)
|- literateDiffViewer.es.js
|- style.css
|- index.html
|- main.js
|- README.md
|- src
 |- 0_src_file
 |- 1_src_file
 ...
```

For `literateDiffViewer.es.js`, `style.css` `index.html` and `main.js`, use the files in [this directory](https://github.com/abagames/literate-diff-viewer/tree/master/docs/literate-diff-viewer).

### Placing source code files

Place the source code files to be explained under the `src` directory.

In the `src` directory, place several source code files that have been written incrementally in the order in which they are to be implemented.

### Write README.md

Write a description of the source code in `README.md`.

### Refer to source code from README.md

You can refer to the source code by writing the following text in the `README.md`

```
 (src) [0_animals_array.js](./src/0_animals_array.js)
```

(src) [0_animals_array.js](./src/0_animals_array.js)

The newly appended source code will be displayed on the right side of the screen. The display is in a [unified format of diff](https://en.wikipedia.org/wiki/Diff#Unified_format). Lines with `+` at the beginning are added lines, and lines with `-` are deleted lines.

(src) [1_push_dogs.js](./src/1_push_dogs.js)

You may specify `(src_hide)` or `(src_silent)` as well as `(src)`.

<br><br><br><br>

```
 (src_hide) 2_push_cows.js
```

(src_hide) 2_push_cows.js

By specifying `(src_hide)`, the right diff display can be changed without displaying the source code file name in the README.

<br><br><br><br>

```
 (src_silent) 3_push_multiple.js
```

(src_silent) 3_push_multiple.js

By specifying `(src_silent)`, you can change the current source code without displaying the source code file name in the README and without changing the diff display. This is useful for narrowing the range of source code to be displayed in the next diff display.

<br><br><br><br>

(src) [4_push_multiple_result.js](./src/4_push_multiple_result.js)

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

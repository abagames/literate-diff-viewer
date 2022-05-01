const path = require("path");
const { defineConfig } = require("vite");

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "literate-diff-viewer",
      formats: ["umd"],
      fileName: () => `literateDiffViewer.js`,
    },
    outDir: "build/",
    minify: false,
  },
};

module.exports = defineConfig(config);

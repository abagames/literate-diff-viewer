const sampleName = "pinclimb";

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: `samples/${sampleName}/`,
  base: "./",
  build: { outDir: `../../docs/${sampleName}` },
};

export default config;

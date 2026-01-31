import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["api/index.ts"],
  format: ["esm"],
  target: "node18",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  skipNodeModulesBundle: true,
  noExternal: [],
});

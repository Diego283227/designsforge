const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("path");

module.exports = {
  output: {
    path: join(__dirname, "dist"),
    ...(process.env.NODE_ENV !== "production" && {
      devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    }),
  },
  resolve: {
    alias: {
      "@packages": join(__dirname, "../../packages"),
      "@apps": join(__dirname, "../../apps"),
    },
    extensions: [".ts", ".js", ".json"],
  },
  // CRÍTICO: Excluir @prisma/client del bundle
  externals: {
    "@prisma/client": "commonjs @prisma/client",
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: "none",
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};

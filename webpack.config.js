const path = require("node:path");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const fs = require("node:fs");
// const { isContext } = require('vm');

class IgnoreEmitPlugin {
  constructor(filesToIgnore) {
    this.filesToIgnore = filesToIgnore;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap("IgnoreEmitPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "IgnoreEmitPlugin",
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          Object.keys(assets).forEach((filename) => {
            this.filesToIgnore.forEach((pattern) => {
              if (filename.match(pattern)) {
                delete compilation.assets[filename];
              }
            });
          });
        },
      );
    });
  }
}

function getAllCSSFiles(dir, fileList = {}) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    const dirName = path.basename(path.dirname(filePath));

    if (stat.isDirectory()) {
      // Recursively call the function if the file is a directory
      getAllCSSFiles(filePath, fileList);
    } else if (file.endsWith("index.css") && /^Lds/.test(dirName)) {
      const componentName = path.basename(dirName, ".css");
      fileList[componentName] = filePath;
    } else if (
      file.endsWith("index.css") &&
      filePath.includes("LdsFooter/v1")
    ) {
      fileList.LdsFooterV1 = filePath;
    } else if (
      file.endsWith("index.css") &&
      filePath.includes("LdsFooter/v2")
    ) {
      fileList.LdsFooterV2 = filePath;
    } else if (file.endsWith(".css") && /^[A-Z][a-zA-Z0-9]*\.css$/.test(file)) {
      // Match component-specific CSS files like Accordion.css
      const componentName = path.basename(file, ".css");
      fileList[componentName] = filePath;
    }
  });
  return fileList;
}

const ldsLayout = [
  path.resolve(__dirname, "/node_modules/@elilillyco/ux-lds/dist/index.css"),
  path.resolve(
    __dirname,
    "/node_modules/@elilillyco/ux-lds/dist/theme/index.css",
  ),
  path.resolve(
    __dirname,
    "/node_modules/@elilillyco/ux-lds/dist/layout/index.css",
  ),
  path.resolve(
    __dirname,
    "/node_modules/@elilillyco/ux-lds/dist/typography/index.css",
  ),
];

// const ldsFont = [
//   path.resolve(__dirname, 'node_modules/@elilillyco/ux-lds/dist/css/fonts/lds.css'),
// ];

// const ldsReset = [
//   path.resolve(__dirname, 'node_modules/@elilillyco/ux-lds/dist/css/base/_index.css'),
// ];

const ldsIcons = [
  path.resolve(
    __dirname,
    "node_modules/@elilillyco/ux-lds/dist/icons/index.css",
  ),
];
const ldsComponents = {
  ...getAllCSSFiles("node_modules/@elilillyco/ux-lds/dist/components"),
};

module.exports = {
  mode: "production",
  entry: {
    lds: ldsLayout,
    // fonts: ldsFont,
    // reset: ldsReset,
    icons: ldsIcons,
    ...ldsComponents,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "lds"),
    publicPath: "/lds/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "blocks"),
          path.resolve(__dirname, "node_modules/@elilillyco/ux-lds/dist"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Add a rule for image files
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2)$/, // Add a rule for font files
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [path.resolve(__dirname, "lds/*")], // Delete existing contents of the lds folder
        },
        // onEnd: {
        //   copy: [
        //     {
        //       source: path.resolve(__dirname, 'node_modules/@elilillyco/ux-lds/dist/functions/'),
        //       destination: path.resolve(__dirname, 'lds/functions/'),
        //     },
        //     {
        //       source: path.resolve(__dirname, 'node_modules/@elilillyco/ux-lds/dist/util/'),
        //       destination: path.resolve(__dirname, 'lds/util/'),
        //     },
        //   ],
        // },
      },
    }),

    new MiniCssExtractPlugin({
      filename: (pathData) => {
        const { name } = pathData.chunk; // Get the entry name
        return /(lds|fonts|reset)$/i.test(name)
          ? `/${name}.css`
          : `/components/${name}.css`;
      },
    }),
    new IgnoreEmitPlugin([/\.js$/, /\.LICENSE\.txt$/]),
  ],
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers
      // (i.e. `terser-webpack-plugin`), uncomment the next line
      "...",
      new CssMinimizerPlugin(),
    ],
  },
};

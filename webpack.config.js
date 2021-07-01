const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const WebpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  // оптимизируем в зависимости от режима сборки
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      // options: {
      //   hmr: isDev,
      //   reloadAll: true,
      // },
    },
    "css-loader",
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      // работаем с html
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd, // оптимизируем HTML
      },
    }),
    new CleanWebpackPlugin(), // очищает dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ];

  if (isProd) {
    base.push(new WebpackBundleAnalyzer());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, "src"), // в какой папке работаем
  mode: "development", // режим разработки
  entry: {
    main: ["@babel/polyfill", "./index.jsx"],
    analytics: "./analytics.ts",
  }, // откуда начинаем
  output: {
    // куда складываем результат
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      // укорачиваем пути до папок
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: optimization(),
  plugins: plugins(),
  devServer: {
    port: 4200,
    open: true,
    hot: isDev,
  },
  devtool: isDev ? "source-map" : false,
  module: {
    rules: [
      {
        test: /\.css$/, // добавляем расширение для чтения css
        use: cssLoaders(),
      },
      {
        test: /\.less$/, // добавляем расширение для чтения less
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/, // добавляем расширение для чтения sass
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"], // добавляем расширение для чтения изображений
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"], // добавляем расширение для чтения шрифтов
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"], // добавляем расширение для чтения xml
      },
      {
        test: /\.js$/, // пропускаем все файлы через js через babel
        exclude: /node_modules/, // кроме этой папки
        use: jsLoaders(),
      },
      {
        test: /\.ts$/, // пропускаем все файлы через js через babel
        exclude: /node_modules/, // кроме этой папки
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },
      {
        test: /\.jsx$/, // пропускаем все файлы через js через babel
        exclude: /node_modules/, // кроме этой папки
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
};

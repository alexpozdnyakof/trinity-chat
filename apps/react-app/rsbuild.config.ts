import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck()],
  experiments: {
    css: true,
  },
  output: {
    distPath: {
      root: "dist", // Директория для выходных файлов
    },
    target: "web", // Цель сборки
    sourceMap: {
      css: "source-map", // Source maps для CSS
    },
    cssModules: {
      auto: true, // Автоматически обрабатывать файлы с .module.css или .module.scss как CSS-модули
      localIdentName: "[name]__[local]___[hash:base64:5]", // Формат имен классов (dev/prod)
      mode: "local", // Локальная область видимости для классов
      exportGlobals: false, // Не экспортировать глобальные стили
    },
    cleanDistPath: true,
  },
  tools: {
    plugins: [
      new MiniCssExtractPlugin({
        filename: "static/css/[name].css", // Сохранять имя исходного файла
        chunkFilename: "static/css/[name].css", // Для асинхронных чанков
      }),
    ],
    rspack: {
      resolve: {
        pnp: true,
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
});

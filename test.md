# webpack

## 单页面打包

### 生成项目

mkdir work
cd work
npm init -y
npm i webpack webpack-cli

#### webpack 初步体验

1. 在根目录下建理 src 文件夹，src 里建 index.js 文件
2. index.js 写入 console.log('start')
3. 新建 webpack.config.js 文件,代码如下

```js
let path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {}
};
```

3. 在 cmd 中运行 npx webpack 生成目录如下

```
.
├── dist
│   └── bundle.js
├── node_modules
├── src
│   └── index.js
├── package.json
├── package-lock.json
└── webpack.config.js
```

4. 在 dist 目录下建立 index.html,在浏览器中打开控制台输出 start

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <script src="./bundle.js"></script>
  </body>
</html>
```

#### 用 npm 指令来运行项目

1. 在 package.json 中增加配置

```json
{
  "name": "work",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack --config webpack.config.js",
    "build": "webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "@babel/preset-react": "^7.7.4",
    "babel": "^6.23.0",
    "babel-loader": "^8.0.6",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  }
}
```

2. 清理掉之前的 dist 目录，rmdir dist 运行 npm run build 生成新的 dist

#### webpack 中使用 react，使用多入口打包 安装 react 和 react-dom

1. 新建 search.js

```js
"use strict";

import React from "react";
import ReactDOM from "react-dom";

class Search extends React.Component {
  render() {
    return <div>Search Text</div>;
  }
}

ReactDOM.render(<Search></Search>, document.getElementById("root"));
```

2. 使用 react 需要使用 babel 对文件进行处理 npm i babel @babel/core @babel/preset-env babel-loader @babel/preset-react
3. 新增.babelrc 文件

```js
{
    "presets": [
        "@babel/preset-env",//处理es6
        "@babel/preset-react"//处理react
    ]
}
```

4. 修改 webpack.config.js 配置,配置 rules

```js
let path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader"
      }
    ]
  }
};
```

5. 运行 npm run build,在 dist 下建立 search.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./search.js"></script>
  </body>
</html>
```

#### webpack 解析 css

1. 修改 search.js

```js
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./search.css";

class Search extends React.Component {
  render() {
    return <div className="search-text">Search Text</div>;
  }
}
ReactDOM.render(<Search></Search>, document.getElementById("root"));
```

2. 新建 search.css

```css
.search-text {
  color: green;
  font-size: 30px;
}
```

3. 下载处理的 loader, npm i css-loader style-loader
4. 配置 rules

```js
let path = require("path");

module.exports = {
  mode: "production", //分为development和production两种
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader"
      },
      {
        test: /.css$/,
        use: [
          "style-loader",
          "css-loader" // 链式调用，从右到左
        ]
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        // use: 'file-loader'
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 102400
            }
          }
        ]
      }
    ]
  }
};
```

5. 运行 npm run build,打开 search.html 样式生效
6. less 的用法以及图片的用法相同

#### 使用 html 模板

1. 根目录下建立 search.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

2. 配置 webpack

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production", //分为development和production两种
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader"
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        // use: 'file-loader'
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 102400
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/search.html"),
      filename: "search.html",
      chunks: ["search"],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ]
};
```

#### webpack-dev-server+HotModuleReplacementPlugin代码热更新

修改 dev 指令"dev": "webpack-dev-server --config webpack.config.js --open"
webpack 配置中增加

```js
devServer: {
    progress: true,
    useLocalIp: true,
    contentBase: './dist',
    hot: true,
    host: "0.0.0.0",
    port: 8088
}
```

运行 npm run dev可做到更新代码页面变化

#### 自动清理打包文件
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins中加入new CleanWebpackPlugin()

#### 文件名打包hash,css的提取与压缩
1. npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin
2. 配置webpack,webpack.prod.js
```js

let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: "production",//分为development和production两种
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name]_[chunkhash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/search.html'),
            filename: 'search.html',
            chunks: ['search'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        progress: true,
        useLocalIp: true,
        contentBase: './dist',
        hot: true,
        host: "0.0.0.0",
        port: 8088
    }
}
```
3. 打包后文件都被单独打包出来了且有后缀




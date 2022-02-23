# Webpack

## loader

模块转换器，webpack 将一切文件视为模块，但 webpack 只能解析 JavaScript 文件，而 loader 作用是让 webpack 拥有了`加载 和 解析非 JavaScript 文件`的能力。

file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
source-map-loader：加载额外的 Source Map 文件，以方便断点调试
image-loader：加载并且压缩图片文件
babel-loader：把 ES6 转换成 ES5
css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
eslint-loader：通过 ESLint 检查 JavaScript 代码
svg-inline-loader：将压缩后的 SVG 内容注入代码中
json-loader : 加载 JSON 文件（默认包含）
ts-loader : 将 TypeScript 转换成 JavaScript
awesome-typescript-loader：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
sass-loader：将 CSS 代码注入 JavaScript 中，通过 DOM 操作去加载 CSS
postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
tslint-loader：通过 TSLint 检查 TypeScript 代码
vue-loader：加载 Vue.js 单文件组件

## plugin

在 webpack `构建流程中的特定时机注入扩展逻辑，`让它具有更多的灵活性。在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

define-plugin：定义环境变量
commons-chunk-plugin：提取公共代码
terser-webpack-plugin : 支持压缩 ES6 (Webpack4)
ignore-plugin：忽略部分文件
html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
web-webpack-plugin：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
mini-css-extract-plugin : 分离样式文件，CSS 提取为独立文件，支持按需加载
serviceworker-webpack-plugin：为网页应用增加离线缓存功能
clean-webpack-plugin : 删除打包文件
happypack：实现多线程加速编译

## 如何利用 webpack 来优化前端性能？

1. 压缩代码。删除多余的代码、注释、简化代码的写法等等方式。
   用 UglifyJsPlugin 和 ParallelUglifyPlugin 压缩 JS 文件
   用 mini-css-extract-plugin 压缩 CSS

2. 利用 CDN 加速。在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径。可以利用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径 3.删除死代码。JS 用 Tree Shaking，CSS 需要使用 Purify-CSS 4.提取公共代码。用 CommonsChunkPlugin 插件

## 分别介绍 bundle，chunk，module 是什么

bundle：是由 webpack 打包出来的文件，
chunk：代码块，一个 chunk 由多个模块组合而成，用于代码的合并和分割。
module：是开发中的单个模块，在 webpack 的世界，一切皆模块，一个模块对应一个文件，webpack 会从配置的 entry 中递归开始找出所有依赖的模块。

# 如何提高 webpack 的构建速度？

1. 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
2. 通过 externals 配置来提取常用库
3. 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
4. 使用 Happypack 实现多线程加速编译
5. 使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
6. 使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码

## .npm 打包时需要注意哪些？如何利用 webpack 来更好的构建？

1. 要支持 CommonJS 模块化规范，所以要求打包后的最后结果也遵守该规则。
   `设置output.libraryTarget='commonjs2'使输出的代码符合CommonJS2 模块化规范，以供给其它模块导入使用`

2. Npm 模块使用者的环境是不确定的，很有可能并不支持 ES6，所以打包的最后结果应该是采用 ES5 编写的。并且如果 ES5 是经过转换的，请最好连同 SourceMap 一同上传。
   `使用babel-loader把 ES6 代码转换成 ES5 的代码。再通过开启devtool: 'source-map'输出SourceMap以发布调试。`

3. Npm 包大小应该是尽量小（有些仓库会限制包大小）
   `Babel 在把 ES6 代码转换成 ES5 代码时会注入一些辅助函数，最终导致每个输出的文件中都包含这段辅助函数的代码，造成了代码的冗余。解决方法是修改.babelrc文件，为其加入transform-runtime插件`

4. 发布的模块不能将依赖的模块也一同打包，应该让用户选择性的去自行安装。这样可以避免模块应用者再次打包时出现底层模块被重复打包的情况。
   `不能将依赖模块打包到NPM模块中的解决方案：使用externals配置项来告诉webpack哪些模块不需要打包。`

5. UI 组件类的模块应该将依赖的其它资源文件，例如.css 文件也需要包含在发布的模块里。
   `通过css-loader和extract-text-webpack-plugin来实现`

## .文件指纹是什么？怎么用？

文件指纹是打包后输出的文件名的后缀。

`Hash`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
`Chunkhash`：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
`Contenthash`：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

## JS 的文件指纹设置

设置 output 的 filename，用 chunkhash。

```js
module.exports = {
  entry: {
    app: './scr/app.js',
    search: './src/search.js',
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist',
  },
};
```

CSS 的文件指纹设置
设置 MiniCssExtractPlugin 的 filename，使用 contenthash。

```js
module.exports = {
  entry: {
    app: './scr/app.js',
    search: './src/search.js',
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`,
    }),
  ],
};
```

图片的文件指纹设置
设置 file-loader 的 name，使用 hash。

占位符名称及含义

ext 资源后缀名
name 文件名称
path 文件的相对路径
folder 文件所在的文件夹
contenthash 文件的内容 hash，默认是 md5 生成
hash 文件内容的 hash，默认是 md5 生成
emoji 一个随机的指代文件内容的 emoji

```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name][hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

## .在实际工程中，配置文件上百行乃是常事，如何保证各个 loader 按照预想方式工作？

可以使用 enforce 强制执行 loader 的作用顺序，pre 代表在所有正常 loader 之前执行，post 是所有 loader 之后执行。(inline 官方不推荐使用)

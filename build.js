/*
 * @Descripttion:
 * @version:
 * @Author: Andy
 * @Date: 2020-12-21 10:18:33
 * @LastEditors: Andy
 * @LastEditTime: 2020-12-21 10:21:04
 */
const path = require("path");

const isRegExp = (str) => Object.prototype.toString.call(str) === "[object RegExp]";
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  //构建方法，返回一个合并后的配置项
  build(config, merge, webpack) {
    const localConfig = {
      //自定义配置项
      resolve: {
        alias: {
          lib: resolve("lib"),
          images: resolve("images"),
          ui: resolve("ui"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          LightSDK: "light-sdk",
        }),
      ],
    };

    //babel配置
    const rules = config.module.rules;
    const babelLoader = rules.find((a) => isRegExp(a.test) && a.test.test(".js"));

    if (babelLoader) {
      babelLoader.options.plugins = [
        // [
        //   // vant 组件按需引入
        //   require(resolve("node_modules/babel-plugin-import")).default,
        //   {
        //     libraryName: "vant",
        //     libraryDirectory: "es",
        //     style: true,
        //   },
        // ],
        [
          require(resolve("node_modules/babel-plugin-transform-runtime")),
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
          },
        ],
        require(resolve("node_modules/babel-plugin-transform-async-to-generator")),

        ...babelLoader.options.plugins,
      ];
    }

    return merge(config, localConfig);
  },
};

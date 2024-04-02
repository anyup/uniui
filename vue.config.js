// const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin') // 最新版本copy-webpack-plugin插件暂不兼容，推荐v5.0.0

// module.exports = {
// 	configureWebpack: {
// 		plugins: [
// 			new CopyWebpackPlugin([
// 				{
// 					from: path.join(__dirname, 'src/images'),
// 					to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'images')
// 				}
// 			])
// 		]
// 	},
// 	chainWebpack: (config) => {
// 		config.plugin("define").tap((args) => {
// 			args[0]["process.env.PLATFORM"] = JSON.stringify(process.env.UNI_PLATFORM);
// 			return args;
// 		});
// 	},
// 	// 以下是利用预处理器和条件注释等技术在 uni-app 中对 static 目录进行条件编译的方法：

// 	// Uni-app 默认支持使用`webpack-chain`插件实现预处理器，例如可以在 `vue.config.js` 中配置：
// 	chainWebpack: (config) => {
// 		// 定义全局常量，可用于条件编译
// 		config.plugin("define").tap((args) => {
// 			args[0]["process.env"]["YOUR_VARIABLE"] = JSON.stringify(
// 				process.env.YOUR_VARIABLE
// 			);
// 			return args;
// 		});
// 	}
// }
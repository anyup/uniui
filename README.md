# anyup-uniui

# 介绍

anyup-uniapp 版本

# UniApp 项目模板

## 一、项目结构

```javascript
├── api                    # 所有请求
├── assets                 # 主题 字体等静态资源
├── common                 # 全局通用工具类
├── components             # 全局公用组件
├── constant               # 全局公用常量
├── i18n                   # 国际化 i18n language
├── mixins                 # 全局混入
├── models                 # 公共实体类
├── nativeplugins          # 原生插件
├── node_modules           # node包管理
├── pages                  # views 所有页面
├── ├──  index             # 视图模块名
├── ├── ├──  index.vue     # 模块入口页面
├── static                 # 存放应用引用静态资源（如图片、视频等）的目录
├── store                  # 全局 store管理
├── unpackage              # 打包存放目录，app资源配置目录
├── wxcomponents           # 小程序组件的目录
├── App.vue                # 入口页面，应用配置，配置App全局样式以及监听
├── main.js                # 入口文件 加载组件 初始化等
├── manifest.json          # 配置应用名称、appid、logo、版本等打包信息
├── package.json           # package.json
└── pages.json             # 配置页面路由、导航条、选项卡等页面类信息
```

## [二、接口请求流程](./docs/md/api.md)

### [Request 文档](./docs/md/request.md)

1. 添加接口地址

```javascript
// constant/modules/user
login: "/app/login", // 用户登陆
```

2. 添加接口方法

```javascript
// api/modules/user.js
import Dispatch from '../dispatch'

const urls = {
  login: { url: '/api/user/login', method: 'GET', loading: true } // 登录示例
}

// 模块导出
module.exports = new Dispatch(urls).register()
```

3. 接口使用

```javascript
<script>
	export default {
        data() {
            return {}
        },
		methods: {
            /**
            * 用户登录
            * @param {Object} params
            */
            doLogin(params) {
                this.$api.user.login(params).then(response => {
                    if (response.code == 1) {
                        // 请求成功处理
                    } else {
                        // 其他处理
                    }
                }).catch(error => {
                    // error处理
                })
            }
    }
  }
</script>
```

## 三、浏览器跨域解决

```javascript
"h5" :
	{
		"title" : "uniapp-uview-template",
		"router" :
		{
			"mode" : "hash",
			"base" : "/h5/"
		},
		"sdkConfigs" :
		{
			"maps" : {}
		},
		"devServer" :
		{
			"https" : false,
			"disableHostCheck" : true,
			"proxy" :
			{
				"/api" :
				{
					"target" : "http://www.api.com",
					"changeOrigin" : true,
					"secure" : false
				}
			}
		}
	}
```

## [四、国际化](./docs/md/i18n.md)

1. 使用方式

在 `script` 中使用方法

```javascript
export default {
  computed: {
    i18n() {
      return this.$t('message')
    }
  },
  methods: {
    // 修改语言 locale：zh,en
    changeLanguage: function (locale) {
      this.$i18n.locale = locale
      this.$store.dispatch('app/setLocale', locale)
    }
  }
}
```

在 `template` 中使用

```html
<view>{{ i18n.str_login }}</view>
```

在 `modules -> zh.js` 中追加翻译字段，需同步追加其他国家翻译

```javascript
module.exports = {
  message: {
    str_login: '登录'
  }
}
```

## [五、Form 表单验证](./docs/md/checker.md)

## 六、分包规范及优化

### [1. 关于分包优化的说明](https://uniapp.dcloud.io/collocation/manifest?id=%e5%85%b3%e4%ba%8e%e5%88%86%e5%8c%85%e4%bc%98%e5%8c%96%e7%9a%84%e8%af%b4%e6%98%8e)

- 在对应平台的配置下添加`"optimization":{"subPackages":true}`开启分包优化
- 目前只支持`mp-weixin`、`mp-qq`、`mp-baidu`的分包优化
- 分包优化具体逻辑：
  > 静态文件：分包下支持 static 等静态资源拷贝，即分包目录内放置的静态资源不会被打包到主包中，也不可在主包中使用
  > js 文件：当某个 js 仅被一个分包引用时，该 js 会被打包到该分包内，否则仍打到主包（即被主包引用，或被超过 1 个分包引用）
  > 自定义组件：若某个自定义组件仅被一个分包引用时，且未放入到分包内，编译时会输出提示信息
  > 分包内静态文件示例

```javascript
"subPackages": [{
    "root": "pages/sub",
    "pages": [{
        "path": "index/index"
    }]
}]

```

以上面的分包为例，放在每个分包 root 对应目录下的静态文件会被打包到此分包内。

### 2. 分包规范

- 新创建 pages 同级目录，subPackage

```javascript
├── pages                  # views 所有页面
├── ├──  index             # 视图模块名
├── ├── ├──  index.vue     # 模块入口页面
├── subPackage             # views 所有页面
├── ├──  pages             # 分包views 所有页面，目录规范参考主包pages
├── ├──  static            # 静态资源，目录规范参考主包static
├── static                 # 存放应用引用静态资源（如图片、视频等）的目录
└── pages.json             # 配置页面路由、导航条、选项卡等页面类信息
```

- pages.json 路由配置

```javascript
	"pages": [
		{ "path": "pages/user/login/login" }
	],
	"subPackages": [{
		"root": "subPackage",
		"pages": [
			{ "path": "pages/index/index" }
		]
	}],
```

## 七、UI 组件库文档

### [1. uViewUI 组件库文档](https://uviewui.com/components/intro.html)

> 本框架使用 UI 组件库

### [2. ThorUI 组件库文档](https://thorui.cn/doc/guide.html)

### [3. UniUI 组件库文档](https://github.com/dcloudio/uni-ui)

> uni-app 官方组件库

### [4. ColorUI 组件库文档](https://github.com/weilanwl/ColorUI)

> 长时间未更新

## [八、CustomIcon 扩展自定义图标库](./docs/md/iconfont.md)

## 九、自封装公用组件文档

### [1. 通用布局组件 Layout](./docs/md/layout.md)

### [2. 版本更新组件 Updater](./docs/md/updater.md)

### [3. 加载组件 Loading](./docs/md/loading.md)

### [4. 提示组件 Toast](./docs/md/toast.md)

## [十、easycom 组件模式](https://uniapp.dcloud.io/collocation/pages?id=easycom)

> HBuilderX 2.5.5 起支持 easycom 组件模式。

### 1. 自定义 easycom 配置的示例

> 如果需要匹配 node_modules 内的 vue 文件，需要使用 packageName/path/to/vue-file-$1.vue 形式的匹配规则，其中 packageName 为安装的包名，/path/to/vue-file-$1.vue 为 vue 文件在包内的路径。

```javascript
"easycom": {
  "autoscan": true,
  "custom": {
    "^uni-(.*)": "@/components/uni-$1.vue", // 匹配components目录内的vue文件
    "^vue-file-(.*)": "packageName/path/to/vue-file-$1.vue" // 匹配node_modules内的vue文件
  }
}
```

### 2. 说明

- `easycom`方式引入的组件无需在页面内`import`，也不需要在`components`内声明，即可在任意页面使用
- `easycom`方式引入组件不是全局引入，而是局部引入。例如在 H5 端只有加载相应页面才会加载使用的组件
- 在组件名完全一致的情况下，`easycom`引入的优先级低于手动引入（区分连字符形式与驼峰形式）
- 考虑到编译速度，直接在`pages.json`内修改`easycom`不会触发重新编译，需要改动页面内容触发。
- `easycom`只处理`vue`组件，不处理小程序组件。暂不处理后缀为`.nvue`的组件，建议参考 uni ui，使用 vue 后缀，同时兼容 nvue 页面。
- `nvue`页面里的`.vue`后缀的组件，同样支持`easycom`

## 十一、分支规范

### 1. 分支简介

- 主分支（长期分支）

1. develop 代码开发分支，所有开发
2. feature 详细功能分支，每个功能分支应该尽可能的小（最好一天以内），开发完成之后尽快移入仓库中
3. release 测试版本发布分支，同时接收该版本的 bugfix，直到稳定之后再发布到 master，并合并到 develop 中。
4. hotfix 紧急修复线上 bug 分支，直接从 master 的版本分出，同时最小版本号加 1。修复完成后发布一个最新版本，同时合并到 develop 中。
5. 辅助分支（短期分支）

- 版本发布分支： master
  > 可执行版本记录分支，上面的每个节点都是发布到线上的一个版本，具体的版本号由 tag 确定

## 十二、开发规范

### 1. pages 页面及内部组件开发规范

(1) 页面创建规范

- pages 页面命名一律采用小写加中划线的方式，不允许使用大写字母或\_
- 命名避免使用中文拼音，应该采用更简明有语义的英文单词进行组合，尽量采用功能性命名，例如 login、register
- 命名注意缩写，但是不能盲目缩写
- 不允许通过 1、2、3 等序号进行命名
- 格式尽量保持统一，创建同名文件夹

(2) 页面架构规范

```javascript
├── pages                               # views 所有页面
├── ├──  user                           # 用户模块
├── ├── ├──  components                 # 模块内部功能组件
├── ├── ├── ├──  login-form             # 登录表单组件
├── ├── ├── ├── ├──  login-form.vue
├── ├── ├──  login                      # 登录页面
├── ├── ├── ├──  login.vue
├── ├── ├──  register                   # 注册页面
├── ├── ├── ├──  register.vue
```

(3) 页面布局规范

- 统一使用公用组件 app-layout 包裹，便于后期在 app-layout 中配置页面插件

```html
<app-layout ref="layout"></app-layout>
```

(4) 内部样式命名规范

- 规则命名中，一律采用小写加中划线的方式，不允许使用大写字母或\_
- 命名避免使用中文拼音，应该采用更简明有语义的英文单词进行组合
- 命名注意缩写，但是不能盲目缩写
- 不允许通过 1、2、3 等序号进行命名
- 避免 class 与 id 重名
- class 用于标识某一个类型的对象，命名必须言简意赅
- 尽可能提高代码模块的复用，样式尽量用组合的方式
- 公共样式名不得包含业务名称
- 书写样式时应尽量避免修改全局公用样式，灵活使用 scope

### 2. components 公用组件开发规范

(1) 组件命名规范

- 命名一律采用小写加中划线的方式，不允许使用大写字母或\_，例如：app-layout
- 格式尽量保持统一，必须创建同名文件夹

(2) 架构规范

```javascript
├── components                              # 全局组件包
├── ├──  app-layout                         # 公用layout
├── ├── ├──  app-layout.vue
```

(3) 注意

- 页面导入全局组件不需要 import，框架自带 easy-com 功能，直接在页面使用，前提是按照（1）步骤命名规范创建

```html
<app-layout ref="layout"></app-layout>
```

### 3. API 接口请求开发规范

(1) 按照模块，统一将接口地址存放至 constant->modulses 文件夹下，文件命名按照功能模块命名，例如：user.js(用户模块)
(2) 按照存放的的接口地址管理 user.js，在 api->modules 文件夹下，开发相对应的调用接口 function

### 4. i18n 国际化文案适配规范

(1) 将翻译文案整理至 modules->zh.js/en.js，或其他待翻译国家

```javascript
module.exports = {
  message: {
    // 英语
    langType: 'en',
    // 以下为翻译内容
    app_name: 'UniAppTemplate',
    str_loading: 'Loading...'
  }
}
```

### 5. common 工具包开发规范

(1) 工具类库命名规范

- 命名一律采用小写，尽量不要分离单词
- 必须创建文件夹，书写 readme 文档

(2) 架构规范

```javascript
├── common                              # 全局工具
├── ├──  utils                          # 公用utils
├── ├── ├──  index.vue
```

### 6. static/assets 静态资源规范

(1) static

- 主要存放静态资源 image

(2) assets

- 主要存放样式 css 和字体 font

### 7. models 实体类开发规范

- 目前主要提取公用实体配置，例如分页 model

### 8. store 状态管理开发规范

(1) 分模块开发管理 store，要添加某状态，需要进行如下步骤：

- 依次添加 state、mutation、action

```javascript
const state = {
  token: '' // 登录token
}
const mutations = {
  // 用户登录token
  SET_TOKEN: (state, value) => {
    state.token = value
  }
}
const actions = {
  setToken({ dispatch, commit }, data) {
    commit('SET_TOKEN', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

- 将状态映射值 getters 管理，使用 g\_前缀

```javascript
const getters = {
  g_token: state => state.user.token
}
export default getters
```

- 注意：因便于使用，使用了 mixin 全局混入，不用在每个页面中单独导入即可使用，所以为避免变量重复问题，getters 中必须使用 g\_前缀开头

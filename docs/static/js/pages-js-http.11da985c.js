(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-js-http"],{"07aa":function(t,e,o){"use strict";o.r(e);var a=o("d10f"),n=o("e96c");for(var r in n)"default"!==r&&function(t){o.d(e,t,(function(){return n[t]}))}(r);o("9cc1");var c,i=o("f0c5"),u=Object(i["a"])(n["default"],a["b"],a["c"],!1,null,"c36c9180",null,!1,a["a"],c);e["default"]=u.exports},"0f0e":function(t,e,o){"use strict";var a=o("ebfd"),n=o.n(a);n.a},1951:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"app-button",options:{styleIsolation:"shared"},props:{type:{type:String,default:"default"},size:{type:String,default:"default"},shape:{type:String,default:"square"},plain:{type:Boolean,default:!1},hollow:{type:Boolean,default:!1},customStyle:{type:Object,default:function(){return{}}},disabled:{type:Boolean,default:!1}}};e.default=a},3952:function(t,e,o){"use strict";o.d(e,"b",(function(){return n})),o.d(e,"c",(function(){return r})),o.d(e,"a",(function(){return a}));var a={appLayout:o("4015").default,configDemo:o("a0cc").default,appButton:o("07aa").default},n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("app-layout",[o("config-demo",{attrs:{list:t.list},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}},[o("app-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.request.apply(void 0,arguments)}}},[t._v("发起请求")]),o("v-uni-view",{staticClass:"json"},[t._v(t._s(t.view))])],1)],1)},r=[]},"48ee":function(t,e,o){"use strict";o("d3b7"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=o("3e52"),n={data:function(){return{http:new a.Http,view:"",value:{baseURL:"http://api.demo.com",method:"get",header:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"},list:[{type:"baseURL",title:"baseURL",tips:"设置统一请求接口地址",layout:"radio",list:["http://api.demo.com"]},{type:"method",title:"请求方式",layout:"radio",list:["get","post","put","patch","head","delete"]},{type:"header",title:"请求header token",layout:"radio",list:["eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"]}]}},onLoad:function(){this.setInterceptor()},methods:{request:function(){var t=this.$u.deepClone(this.value);t.header={token:t.header},this.http.request("/test",{},t)},setInterceptor:function(){var t=this;this.http.interceptors.request.use((function(e){return t.view=JSON.stringify(e),e}),(function(t){return Promise.resolve(t)})),this.http.interceptors.response.use((function(t){return Promise.resolve(t)}),(function(t){return Promise.reject(t)}))}}};e.default=n},6546:function(t,e,o){"use strict";o.r(e);var a=o("48ee"),n=o.n(a);for(var r in a)"default"!==r&&function(t){o.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},"9cc1":function(t,e,o){"use strict";var a=o("d08c"),n=o.n(a);n.a},a618:function(t,e,o){var a=o("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 自定义uview颜色 */\n/* 黑蓝色 */\n/* 金色*/.json[data-v-3cb3ce10]{word-break:break-all}',""]),t.exports=e},bc12:function(t,e,o){var a=o("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 自定义uview颜色 */\n/* 黑蓝色 */\n/* 金色*/.au-btn--darkblue[data-v-c36c9180]{color:#dcb170;border-color:#014794;background-color:#014794}.au-btn--darkblue--disabled[data-v-c36c9180]{color:#dcb170!important;border-color:#6991bd!important;background-color:#6991bd!important}.au-btn--darkblue--plain[data-v-c36c9180]{color:#014794!important;border-color:#6991bd!important;background-color:#bad3ee!important}.au-btn--darkblue--hollow[data-v-c36c9180]{color:#014794!important;border-color:#6991bd!important;background-color:initial!important}.au-btn.au-darkblue-plain-hover[data-v-c36c9180]{color:#014794!important;background-color:#1c62ad!important}.au-btn.au-darkblue-hover[data-v-c36c9180]{color:#014794;background-color:#1c62ad!important}.au-btn--gold[data-v-c36c9180]{color:#fff;border-color:#dcb170;background-color:#dcb170}.au-btn--gold--disabled[data-v-c36c9180]{color:#fff!important;border-color:#e0c9a5!important;background-color:#e0c9a5!important}.au-btn--gold--plain[data-v-c36c9180]{color:#dcb170!important;border-color:#e0c9a5!important;background-color:#f8f0e5!important}.au-btn--gold--hollow[data-v-c36c9180]{color:#dcb170!important;border-color:#e0c9a5!important;background-color:initial!important}.au-btn.au-gold-plain-hover[data-v-c36c9180]{color:#dcb170!important;background-color:#cea973!important}.au-btn.au-gold-hover[data-v-c36c9180]{color:#dcb170;background-color:#cea973!important}',""]),t.exports=e},cc87:function(t,e,o){"use strict";o.r(e);var a=o("3952"),n=o("6546");for(var r in n)"default"!==r&&function(t){o.d(e,t,(function(){return n[t]}))}(r);o("0f0e");var c,i=o("f0c5"),u=Object(i["a"])(n["default"],a["b"],a["c"],!1,null,"3cb3ce10",null,!1,a["a"],c);e["default"]=u.exports},d08c:function(t,e,o){var a=o("bc12");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=o("4f06").default;n("ea6917a2",a,!0,{sourceMap:!1,shadowMode:!1})},d10f:function(t,e,o){"use strict";o.d(e,"b",(function(){return n})),o.d(e,"c",(function(){return r})),o.d(e,"a",(function(){return a}));var a={auButton:o("18f1").default},n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("au-button",{attrs:{type:t.type,size:t.size,shape:t.shape,plain:t.plain,hollow:t.hollow,disabled:t.disabled,loading:!1,"open-Type":"","custom-style":t.customStyle,"custom-types":["gold","darkblue"],"throttle-time":1e3},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.$emit("click")}}},[t._t("default")],2)},r=[]},e96c:function(t,e,o){"use strict";o.r(e);var a=o("1951"),n=o.n(a);for(var r in a)"default"!==r&&function(t){o.d(e,t,(function(){return a[t]}))}(r);e["default"]=n.a},ebfd:function(t,e,o){var a=o("a618");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=o("4f06").default;n("572e21ef",a,!0,{sourceMap:!1,shadowMode:!1})}}]);
### Updater 版本更新管理器-仅限在 app 中使用

### 使用方式

在 `script` 中引用组件

```javascript
import { AuUpdater } from '@/components'
export default {
  components: { AuUpdater }
}
```

在 `template` 中使用组件

```html
<au-updater ref="updater" :auto="true"></au-updater>
```

### 属性说明

| 属性名       | 类型    | 默认值           | 说明                 |
| ------------ | ------- | ---------------- | -------------------- |
| auto         | Boolean | false            | 是否自动检测版本更新 |
| reqUrl       | String  | ""               | 请求接口地址         |
| reqParam     | Object  | {}               | 请求参数             |
| reqMethod    | String  | POST             | 请求方法             |
| reqHeader    | Object  | {}               | 请求 header          |
| reqCodeKey   | String  | "currentVersion" | 请求版本号 key       |
| isForce      | String  | false            | 是否强制更新         |
| maskClosable | String  | false            | 弹窗外部点击         |
| modalTitle   | String  | "版本更新"       | 弹窗标题             |

### 事件说明

| 事件名 | 事件说明     | 返回参数 |
| ------ | ------------ | -------- |
| result | 请求成功回调 | response |

### Toast 提示组件

### 使用方式

在 `script` 中引用组件

```javascript
import { AppToast } from '@/components'
export default {
  components: { AppToast },
  data() {
    return {}
  },
  methods: {
    showToast() {
      let params = {
        title: '操作成功',
        imgUrl: '/static/images/toast/check-circle.png',
        icon: true
      }
      this.$refs.toast.show(params)
    }
  }
}
```

在 `template` 中使用组件

```html
<app-toast ref="toast"></app-toast>
```

### 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |

### 事件说明

| 事件名 | 事件说明 | 返回参数 |
| ------ | -------- | -------- |

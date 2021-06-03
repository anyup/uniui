# anyup-core

#### 介绍

- anyup-core uniapp、vue类库，致力于方便、快捷开发应用

#### 安装教程

- ``npm install @anyup/core``

#### 使用说明

```js
import { Http } from '@anyup/core'
const http = new Http().setBaseURL(baseURL).setHeader(header)

http.interceptors.request.use(
    request => request,
    error => Promise.resolve(error)
)
http.interceptors.response.use(
    response => Promise.resolve(response),
    error => Promise.reject(error)
)
```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

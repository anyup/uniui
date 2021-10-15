## 0.0.28

### BREAKING CHANGES

- 优化 Pager 类分页模式，添加setType(type) 0:总页数分页 1:总数量分页，影响 hasMore() loadmore()方法，无入参，hasMore()方法内部自动page++，无需自己递增

### Bug Fixes

- 优化layout样式，配置clearfix样式，优化margin陷阱样式

---
## 0.0.27

### Bug Fixes

- 优化 loading 取消 bug，兼容小程序显示、隐藏问题

---

## 0.0.26

### BREAKING CHANGES

- 优化 Pager empty, 仅保留 empty() 方法
- 优化 Loading 组件参数，统一 visible 修改为 show

---

## 0.0.25

### Features

- 优化 layout props

### Bug Fixes

- 优化 Toast 提示，兼容微信小程序部分场景

---

## 0.0.24

- 添加 HttpHeader 支持, 支持 json, urlencoded, fromdata
- Http 支持 restURL 格式传递传递

---

## 0.0.23

- 优化分页 Pager, 支持 Object、Array

---

## 0.0.22

- 优化 z-index 层级

---

## 0.0.21

- 优化 Pager 及内部方法

---

## 0.0.18

- 优化 Http，支持 Upload
- 优化 Class 命名规范

---

## 0.0.1

- Initial release

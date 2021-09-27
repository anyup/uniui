import deepMerge from '../function/deepMerge'

/**
 * 数据分页类
 * @author qiaomingxing
 */
class Pager {
  constructor(page = 1, limit = 20) {
    this.page = page // 当前页数
    this.limit = limit // 每页数量
    this.pages = 0 // 总页数
    this.total = 0 // 总数量
    this.data = [] // 数据
  }

  get offset() {
    if (isObject(this.data)) {
      return 0
    }
    return this.data.length
  }

  empty() {
    if (isObject(this.data)) {
      return isEmptyObject(this.data)
    }
    return this.data.length === 0
  }

  setPage(page) {
    this.page = page
    return this
  }

  setLimit(limit) {
    this.limit = limit
    return this
  }

  setData(data, reset = false) {
    if (reset) {
      this.data = data
    } else if (isObject(data)) {
      this.data = isArray(this.data) ? {} : this.data
      this.data = deepMerge(this.data, data)
    } else {
      this.data = [...this.data, ...data]
    }
    return this
  }

  setPages(pages) {
    this.pages = pages
    return this
  }

  setTotal(total) {
    this.total = total
    return this
  }

  pagePlus() {
    this.page++
    return this
  }

  pageMinus() {
    this.page--
    return this
  }

  hasMore(offset = false) {
    if (offset) {
      return this.offset < this.total
    }
    return this.page < this.pages
  }

  // 加载状态: more,loading,noMore
  loadmore(offset = false) {
    let status = ''
    if (offset) {
      if (this.total <= this.limit) {
        status = ''
      } else if (this.offset >= this.total) {
        status = 'nomore'
      } else {
        status = 'loading'
      }
    } else {
      if (this.empty || this.pages <= 1) {
        status = ''
      } else if (this.page >= this.pages) {
        status = 'nomore'
      } else {
        status = 'loading'
      }
    }
    return status
  }
}

function isArray(arr) {
  return Array.isArray(arr)
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

export { Pager }

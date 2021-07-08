class Pager {
  constructor(page = 1, limit = 20) {
    this.page = page // 当前页数
    this.limit = limit // 每页数量
    this.pages = 0 // 总页数
    this.total = 0 // 总数量
    this.data = [] // 数据
  }

  get offset() {
    return this.data.length
  }

  get empty() {
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

  isEmpty() {
    return this.data.length === 0
  }

  hasMore(offset = false) {
    if (offset) {
      return this.offset < this.total
    }
    return this.page < this.pages
  }

  // 加载状态: more,loading,noMore
  getLoadStatus(offset = false) {
    let status = ''
    if (offset) {
      if (this.data.length === 0 || this.offset === 0) {
        status = ''
      } else if (this.offset >= this.total) {
        status = 'nomore'
      } else {
        status = 'loading'
      }
    } else {
      if (this.data.length === 0 || this.pages <= 1) {
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

export { Pager }

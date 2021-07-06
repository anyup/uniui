class Pager {
  constructor(page = 1, limit = 20) {
    this.page = page // 当前页数
    this.limit = limit // 每页数量
    this.pages = 0 // 总页数
    this.total = 0 // 总数量
    this.data = [] // 数据
  }
  setPage(page) {
    this.page = page
    return this
  }
  setLimit(limit) {
    this.limit = limit
    return this
  }
  setData(data) {
    this.data = data
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
  hasMore() {
    return this.page < this.pages
  }
  // 加载状态: more,loading,noMore
  getLoadStatus() {
    if (this.data.length === 0 || this.pages <= 1) {
      return ''
    }
    if (this.page >= this.pages) {
      return 'nomore'
    }
    if (this.data.length > 0) {
      return 'loading'
    }
  }
}

export { Pager }

/**
 * @name  pagination
 * @desc  纯JS前端分页方法
 * @param  {Number} page 当前页码，默认1
 * @param  {Number} limit 每页最多显示条数，默认10
 * @param  {Array} totalData 总的数据集，默认为空数组
 * @return {Object}
 **/
function pagination(totalData = [], page = 1, limit = 10) {
  const { length } = totalData
  const tableData = {
    data: [],
    page,
    limit,
    total: length,
    pages: Math.ceil(length / limit)
  }
  if (limit >= length) {
    //limit大于等于总数据长度，说明只有1页数据或没有数据
    tableData.data = totalData
    tableData.page = 1 //直接取第一页
  } else {
    //limit小于总数据长度，数据多余1页
    const num = limit * (page - 1) //计算当前页（不含）之前的所有数据总条数
    if (num < length) {
      //如果当前页之前所有数据总条数小于（不能等于）总的数据集长度，则说明当前页码没有超出最大页码
      const startIndex = num //当前页第一条数据在总数据集中的索引
      const endIndex = num + limit - 1 //当前页最后一条数据索引
      tableData.data = totalData.filter((_, index) => index >= startIndex && index <= endIndex) //当前页数据条数小于每页最大条数时，也按最大条数范围筛取数据
    } else {
      //当前页码超出最大页码，则计算实际最后一页的page，自动返回最后一页数据
      const size = parseInt(length / limit) //取商
      const rest = length % limit //取余数
      if (rest > 0) {
        //余数大于0，说明实际最后一页数据不足limit，应该取size+1为最后一条的页码
        tableData.page = size + 1 //当前页码重置，取size+1
        tableData.data = totalData.filter((_, index) => index >= limit * size && index <= length)
      } else if (rest === 0) {
        //余数等于0，最后一页数据条数正好是limit
        tableData.page = size //当前页码重置，取size
        tableData.data = totalData.filter((_, index) => index >= limit * (size - 1) && index <= length)
      } //注：余数不可能小于0
    }
  }
  return tableData
}

export default pagination

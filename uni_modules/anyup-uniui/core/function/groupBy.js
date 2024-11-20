/**
 * 分组
 *
 * @param {Array} arr 数组
 * @param {Function} f1 回调函数，说明按照那个key分组
 * @param {Function} f2 回调函数，返回结果结构
 * @return Array
 * @demo groupBy(list, function(item){ return item.name })
 */
function groupBy(arr, f1, f2) {
  let groups = {};
  arr.forEach(function (o) {
    let group = f1(o);
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return f2 ? f2(group, groups) : groups[group];
  });
}

export default groupBy;

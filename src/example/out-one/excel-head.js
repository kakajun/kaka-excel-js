    /**
 * @description: 递归获取头部所有id
 * @param {*} columns
 * @param {*} keys
 * @return {*}
 */
 export function getColumnsIds(columns, keys) {
  let isColgroup=false
  const nodes = keys || [];
  for (let index = 0; index < columns.length; index++) {
    const obj = columns[index];
    if (obj.hidden) continue; // 隐藏行跳过
    if (obj.children) {
      isColgroup=true
      getColumnsIds(obj.children, nodes);
    } else {
      if (obj.field) {
        // 直接把整个对象push进去
       nodes.push(obj);
      }

    }
  }
  return {nodes,isColgroup};
 }

 /**
  * @description: 处理多表头
  * @param {*}
  * @return {*}
  */
 export function getMultiHeader() {
return []
}

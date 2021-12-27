/**
 * @description: 递归获取头部所有id
 * @param {*} columns
 * @param {*} keys
 * @return {*}
 */
function getColumnsIds(columns, keys) {
  const nodes = keys || [];
  for (let index = 0; index < columns.length; index++) {
    const obj = columns[index];
    if (obj.hidden) continue; // 隐藏行跳过
    if (obj.children) {
      getColumnsIds(obj.children, nodes);
    } else {
      if (obj.field) {
        // 直接把整个对象push进去
        nodes.push(obj);
      }
    }
  }
  return nodes;
}
let CURRENT_CELL_INDEX = 0;

/**
 * @description: 设置列的属性CellIndex,CellCode
 * @param {*} columns
 * @param {*} parentNode
 * @return {*}
 */
function setCellCode(columns, parentNode) {
  const levels = [];
  columns.forEach((li, index) => {
    if (!CURRENT_CELL_INDEX) {
      CURRENT_CELL_INDEX = 1;
    } else {
      CURRENT_CELL_INDEX++;
    }
    if (parentNode && index == 0) {
      CURRENT_CELL_INDEX = parentNode.CellIndex;
    }
    li.CellIndex = CURRENT_CELL_INDEX;
    li.CellCode = numberToCellCode(CURRENT_CELL_INDEX);
    const children = li.children;
    if (children && children.length > 0) {
      setCellCode(children, li);
    }
  });
  return levels;
}
//转换数字到EXCEL单元格编号
function numberToCellCode(number) {
  let s = "";
  while (number > 0) {
    let m = number % 26;
    if (m === 0) m = 26;
    s = String.fromCharCode(m + 64) + s;
    number = (number - m) / 26;
  }
  return s;
}

/**
 * @description: 获取最大层级
 * @param {*} columns
 * @param {*} parentNode
 * @return {*}
 */
function getLevels(columns, parentNode) {
  const levels = [];
  columns.forEach((li, index) => {
    li.level = parentNode ? parentNode.level + 1 : 0;
    levels.push(li.level);
    const children = li.children;
    if (children && children.length > 0) {
      const result = getLevels(children, li);
      levels.push(...result);
    }
  });
  return levels;
}
/**
 * @description: 处理标题的合并
 * @param {*} titleLength
 * @param {*} merges
 * @return {*}
 */
function setTitleMerges(titleLength, merges = []) {
  let mergeSecond = "A1";
  if (titleLength > 26) {
    const one = parseInt(titleLength / 26);
    const two = titleLength % 26;
    //转换数字到EXCEL单元格编号
    mergeSecond = numberToCellCode(one) + numberToCellCode(two) + "1";
  } else {
    mergeSecond = numberToCellCode(titleLength) + "1";
  }
  const titleMerge = `A1:${mergeSecond}`;
  if (!merges) {
    merges = [titleMerge];
  } else {
    if (merges.indexOf(titleMerge) === -1) {
      merges.push(titleMerge);
    }
  }
  return merges;
}

/**
 * @description: 获取跨列
 * @param {*} column
 * @return {*}
 */
function getColSpan(column) {
  var colSpan = 0;
  var children = column.children || [];
  for (var i = 0; i < children.length; i++) {
    var item = children[i];
    if (item.children && item.children.length > 0) {
      colSpan += getColSpan(item);
    } else {
      colSpan += 1;
    }
  }
  if (colSpan == 0) {
    colSpan = 1;
  }
  return colSpan;
}

/**
 * @description: 获取跨行
 * @param {*} column
 * @param {*} maxLevel
 * @return {*}
 */
function getRowSpan(column, maxLevel) {
  let rowSpan = 1;
  if (!column.children || column.children.length === 0) {
    rowSpan = maxLevel - column.level + 1;
  }
  return rowSpan;
}

/**
 * @description: 设置合并
 * @param {*} columns
 * @param {*} maxLevel
 * @param {*} merges
 * @param {*} multiHeader
 * @return {*}
 */
function setMerges(
  columns = [],
  maxLevel,
  merges = [],
  title,
  multiHeader = []
) {
  // 如果有title,那么所有行都要下移一个单位,也就是merge的索引第一位都要+1
  columns.forEach((li, index) => {
    const level = li.level + 1;
    const cellIndex = li.CellIndex - 1;
    const CellCode = li.CellCode;
    const cellTitle = li.title;
    const colSpan = getColSpan(li);
    const rowSpan = getRowSpan(li, maxLevel);
    li.colSpan = colSpan;
    li.rowSpan = rowSpan;
    if (!multiHeader[level - 1]) {
      multiHeader[level - 1] = [];
    }
    if (rowSpan > 1) {
      merges.push(
        `${CellCode}${title ? level + 1 : level}:${CellCode}${
          title ? level + rowSpan : level + rowSpan - 1
        }`
      );
      console.log(merges);
      multiHeader[level - 1][cellIndex] = cellTitle;
      for (let i = 1; i < rowSpan; i++) {
        if (!multiHeader[level - 1 + i]) {
          multiHeader[level - 1 + i] = [];
        }
        multiHeader[level - 1 + i][cellIndex] = "";
      }
    } else {
      multiHeader[level - 1][cellIndex] = cellTitle;
    }
    if (colSpan > 1) {
      let endCellIndex = cellIndex + 1;
      let emptyCell = [];
      for (let i = 1; i < colSpan; i++) {
        endCellIndex++;
        emptyCell.push("");
      }
      const endCellCode = numberToCellCode(endCellIndex);
      console.log(CellCode, endCellCode);
      multiHeader[level - 1].splice(cellIndex + 1, 0, ...emptyCell);
      merges.push(
        `${CellCode}${title ? level + 1 : level}:${endCellCode}${
          title ? level + 1 : level
        }`
      );
      console.log(merges);
    }
    const children = li.children;
    if (children && children.length > 0) {
      setMerges(children, maxLevel, merges, title, multiHeader);
    }
  });
  return { multiHeader, merges };
}

export {
  numberToCellCode,
  getColumnsIds,
  setTitleMerges,
  getLevels,
  setMerges,
  setCellCode,
};

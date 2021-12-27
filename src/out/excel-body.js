/**
 * 获取完整的表格数据，把合并的单元格补充上去
 * @param header
 * @param body
 * @returns {*[]}
 */
function fillTableData({ header, body }) {
  let headerCopy = [];
  let bodyCopy = [];
  header.forEach((row) => {
    let copyRow = [];
    for (let key in row) if (key) copyRow.push(row[key]);
    headerCopy.push(copyRow);
  });
  body.forEach((row) => {
    let copyRow = [];
    for (let key in row) if (key) copyRow.push(row[key]);
    bodyCopy.push(copyRow);
  });

  for (let rowIndex = 0, len = headerCopy.length; rowIndex < len; rowIndex++) {
    let colIndex = 0;
    let rowCopy = headerCopy[rowIndex].concat();
    for (
      let i = 0, headerCopyLen = headerCopy[rowIndex].length;
      i < headerCopyLen;
      i++
    ) {
      fillCell(headerCopy, rowIndex, colIndex, rowCopy[i]);
      colIndex += rowCopy[i].colspan;
    }
  }

  for (let rowIndex = 0, len = bodyCopy.length; rowIndex < len; rowIndex++) {
    let colIndex = 0;
    let rowCopy = bodyCopy[rowIndex].concat();
    for (
      let i = 0, headerCopyLen = bodyCopy[rowIndex].length;
      i < headerCopyLen;
      i++
    ) {
      fillCell(bodyCopy, rowIndex, colIndex, rowCopy[i]);
      colIndex += rowCopy[i].colspan;
    }
  }

  return headerCopy.concat(bodyCopy);
}

/**
 * 填充被合并的单元格
 * @param data
 * @param rowIndex
 * @param colIndex 当前数据坐标
 * @param rowSpan 1
 * @param colspan 2
 */
function fillCell(data, rowIndex, colIndex, cell) {
  let rowspan = cell.rowspan;
  let colspan = cell.colspan;
  // 列合并
  if (colspan > 1 && rowspan === 1) {
    fillCol(colspan, data[rowIndex], colIndex, cell);
  } else if (rowspan > 1 && colspan === 1) {
    // 行合并
    fillRow(data, rowspan, rowIndex, colIndex, cell);
  } else if (rowspan > 1 && colspan > 1) {
    // 列行都合并
    fillCol(colspan, data[rowIndex], colIndex, cell); // 合并当前行列
    fillRow(data, rowspan, rowIndex, colIndex, cell);
    for (let i = 1; i < rowspan; i++) {
      fillCol(colspan, data[rowIndex + i], colIndex, cell);
    }
  }
}

/**
 *  补充列
 * @param colspan
 * @param row
 * @param colIndex
 * @param cell
 */
function fillCol(colspan, row, colIndex, cell) {
  let cellcopy = Object.assign({}, cell);
  for (let i = 1; i < colspan; i++) {
    // 在当前坐标添加数据，添加colspan-1次
    row.splice(
      colIndex + 1,
      0,
      Object.assign(cellcopy, { colspan: 1, rowspan: 1 })
    );
  }
}
/**
 * 补充行
 * @param data
 * @param rowspan
 * @param rowIndex
 * @param colIndex
 * @param cell
 */
function fillRow(data, rowspan, rowIndex, colIndex, cell) {
  let cellcopy = Object.assign({}, cell);
  for (let i = 1; i < rowspan; i++) {
    // 在当前坐标添加数据，添加rowspan-1次
    data[rowIndex + i].splice(
      colIndex,
      0,
      Object.assign(cellcopy, { colspan: 1, rowspan: 1 })
    );
  }
}

/**
 * 获取合并的单元格 :
 *
 */
function getDataAndmerges(tableData) {
  let excelData = [];
  let merges = [];
  for (let rowIndex = 0, rLen = tableData.length; rowIndex < rLen; rowIndex++) {
    //循环表格数据
    let excelRow = [];
    for (
      let colIndex = 0, cLen = tableData[rowIndex].length;
      colIndex < cLen;
      colIndex++
    ) {
      // 循环每一行数据
      excelRow.push(tableData[rowIndex][colIndex].value);
      let merge = getMerge(tableData[rowIndex][colIndex], rowIndex, colIndex);
      if (merge) merges.push(merge);
    }
    excelData.push(excelRow);
  }
  return { excelData: excelData, merges };
}


/**
 * 获取合并单元格 地址
 * 单元格地址对象的存储格式为{c:C, r:R}，其中C和R分别代表的是0索引列和行号。例如单元格地址B5用对象{c:1, r:4}表示。
 * 单元格范围对象存储格式为{s:S, e:E}，其中S是第一个单元格，E是最后一个单元格。范围是包含关系。例如范围 A3:B7用对象{s:{c:0, r:2}, e:{c:1, r:6}}表示
 * @param cell
 * @param rowIndex
 * @param colIndex
 * @returns {{s: {r: *, c: *}, e}|null}
 */
function getMerge(cell, rowIndex, colIndex) {
  // c 列，r:行
  let s = { c: colIndex, r: rowIndex }; // 第一个单元格
  let e = {}; // 最后一个单元格
  if (cell.colspan > 1 && cell.rowspan === 1) {
    // 列合并
    e = { r: rowIndex, c: colIndex + cell.colspan - 1 };
  } else if (cell.rowspan > 1 && cell.colspan === 1) {
    // 行合并
    e = { r: rowIndex + cell.rowspan - 1, c: colIndex };
  } else if (cell.rowspan > 1 && cell.colspan > 1) {
    // 行列合并
    e = { r: rowIndex + cell.rowspan - 1, c: colIndex + cell.colspan - 1 };
  }
  if (Object.keys(e).length) return { s, e };
  return null;
}

export {fillTableData,getDataAndmerges}

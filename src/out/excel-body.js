import createDebugger from 'debug'
const debug = createDebugger('excel-body')
if (process.env.NODE_ENV==='development') {
debug.enabled = true
}
/**
 * 获取完整的表格数据，把合并的单元格补充上去
 * @param header
 * @param body
 * @returns {*[]}
 */
function fillTableData( body ) {
  let bodyCopy = [];
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

  return bodyCopy
}

    // 通用行合并函数（将相同多列数据合并为一行）
 function   rowspanMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["sex"];
      const cellValue = row[column.property];
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    }
function  colspanMethod({ rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 1) {
          return { rowspan: 2, colspan: 1 }
        } else if (columnIndex === 2) {
          return { rowspan: 1, colspan: 2 }
        } else if (columnIndex === 3) {
          return { rowspan: 0, colspan: 0 }
        }
      }
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


export default fillTableData

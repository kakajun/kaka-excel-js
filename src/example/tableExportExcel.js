/* eslint-disable */
import XLSX from "xlsx";
import STYLEXLSX from "cnbi-xlsx-style";
import FileSaver from "file-saver";

/**
 *  update:shj 2021/10/29
 *  vxe-table 报表导出excel实现方式
 *  1.获取dom元素，每个单元格按对象形式存储 ：{rowSpan:行数,colSpan:列数,value:文字,isDecimal:是不是文字类型（单元格样式用到） }
 *  2.根据dom元素，补全表格把合并的单元格补齐（被合并的单元格colspan,rowspan改为1，合并后的不变）
 *  3.获取合并的单元格在excel中的地址
 *  4.根据补全数据导出到excel中，设置合并单元格，设置每个单元格样式
 */

function exportExcel(id, columns, datas, filename = "test") {
  const heards = getColumnsIds(columns);
  let dom = document.getElementById(id);
  dom = dom.getElementsByClassName("vxe-table--main-wrapper")[0];
  let header = getTableDomRows(dom);

  const body = datas.map((item) => {
    let arr = [];
    for (let index = 0; index < heards.length; index++) {
      let id = heards[index];
      arr.push(item[id]);
    }
    return arr;
  });
  const tableRows = { header, body };
  let tableData = fillTableData(tableRows); // 填充后的 表格数据
  let headNum = header.length;
  let cols = getColWidth(tableData[headNum - 1]); // 列宽
  let excel = getDataAndmerges(tableData); // 获取excel数据，及合并的单元格
  let ws = getWs(tableData, headNum);
  var wb = XLSX.utils.book_new();
  ws["!merges"] = excel.merges;
  ws["!cols"] = cols;
  wb.SheetNames.push("sheet");
  wb.Sheets["sheet"] = ws;
  var wbout = STYLEXLSX.write(wb, {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
  });
  FileSaver.saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    }),
    `${filename}.xlsx`
  );
}

/**
 * @description: 递归获取头部所有id
 * @param {*} datas
 * @param {*} keys
 * @return {*}
 */
function getColumnsIds(datas, keys) {
  const nodes = keys || [];
  for (let index = 0; index < datas.length; index++) {
    const obj = datas[index];
    if (obj.hidden) continue; // 隐藏行跳过
    if (obj.children) {
      getColumnsIds(obj.children, nodes);
    } else {
      nodes.push(obj.field);
    }
  }
  return nodes;
}
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

/**
 *  根据dom 元素获取 表格单元格数据，及所占行列，数据类型
 * @param dom
 * @returns {{header: Array, body: Array}}
 */
function getTableDomRows(dom) {
  let header = [];
  let domHeader = dom.getElementsByClassName("vxe-header--row"); // 表头行
  for (let i = 0, len = domHeader.length; i < len; i++) {
    let th = domHeader[i].getElementsByTagName("th"); // // 表头第i个tr的th
    let count = th.length;
    let tr = {};
    for (let j = 0; j < count; j++) {
      let rowSpan = th[j].rowSpan;
      let colSpan = th[j].colSpan;
      let text = th[j].textContent; // th 中的字
      // tr['index'+j] = text+'->'+colSpan+'-'+rowSpan
      let isDecimal = th[j]._prevClass.includes("decimal");
      tr["index" + j] = {
        value: text,
        colspan: colSpan,
        rowspan: rowSpan,
        type: isDecimal ? "decimal" : "string",
      };
      if (th[j]._prevClass.indexOf("col--last") > -1) {
        j = count;
      }
    }
    header.push(tr); // 最后用的表头
  }
  return header;
}

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

/**
 * 根据第一行设置每列的宽度  TODO 动态处理宽度
 * @param row
 */
function getColWidth(row) {
  let cols = [];
  row.forEach((r) => {
    if (r.type === "string") cols.push({ wpx: 200 });
    else if (r.type === "decimal") cols.push({ wpx: 100 });
    else cols.push({ wpx: 150 });
  });
  return cols;
}

function getWs(data, headNum) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != data.length; ++R) {
    // 行
    for (var C = 0; C != data[R].length; ++C) {
      // 列
      var cellObject = data[R][C];
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let value = cellObject.value;
      if (cellObject.type === "decimal" && cellObject.value === "--")
        value = "-";
      var cell = { v: value };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
      // if (cellObject.type === 'decimal') cell.t = 'n';
      // else if (cellObject.type === 'boolean') cell.t = 'b';
      // else cell.t = 's';
      cell.t = "s"; // 素有单元格都设置成文字类型
      setCellStyle(cell, cellObject, R < headNum ? "header" : "content");
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

/**
 * 设置单元格样式
 * @param cell
 * @param cellObject
 * @param type
 */
function setCellStyle(cell, cellObject, type) {
  var border_s = {
    //单元格外侧框线
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: {
      style: "thin",
    },
    right: {
      style: "thin",
    },
  };
  var headerStyle = {
    font: {
      // 字体样式设置 "#606266;"
      name: "宋体",
      sz: 14,
      // color: { rgb: "606266" },
      bold: true,
    },
    fill: {
      // 背景颜色设置
      // fgColor: { rgb: "f0f8ff" }
    },
    alignment: {
      // 是否居中center | 左对齐left | 右对齐right
      horizontal: "center",
      vertical: "center",
    },
    border: border_s,
  };
  var cellStyle = {
    font: {
      // 字体样式设置 "#606266;"
      name: "宋体",
      sz: 12,
      // color: { rgb: "606266" },
      bold: false,
    },
    alignment: {
      // 是否居中center | 左对齐left | 右对齐right
      horizontal: cellObject.type === "decimal" ? "right" : "left",
      vertical: "center",
    },
    border: border_s,
  };
  if (type === "header") cell.s = headerStyle;
  else cell.s = cellStyle;
}

export default exportExcel;

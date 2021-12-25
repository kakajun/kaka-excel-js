import XLSX from "pikaz-xlsx-style";
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

 const excelDefault = {
  sheetName: "sheet",
  globalStyle: {
    border: {
      top: {
        style: "thin",
        color: { rgb: "000000" },
      },
      bottom: {
        style: "thin",
        color: { rgb: "000000" },
      },
      left: {
        style: "thin",
        color: { rgb: "000000" },
      },
      right: {
        style: "thin",
        color: { rgb: "000000" },
      },
    },
    font: {
      name: "宋体",
      sz: 12,
      color: { rgb: "000000" },
      bold: false,
      italic: false,
      underline: false,
      shadow: false,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: false,
    },
    fill: {
      fgColor: { rgb: "ffffff" },
    },
  },
};

/**
 * 根据第一行设置每列的宽度
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

  /**
 * @description: 设置数据类型
 * @param {*} data
 * @param {*} headNum
 * @return {*}
 */
function getWs(data, headNum) {
  debugger
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
export{getColWidth,excelDefault,setCellStyle,getWs}

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
 * @name: 转化时间格式
 * @param {type}
 * @return:
 */
function datenum(v, date1904) {
  if (date1904) v += 1462;
  const epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

  /**
 * @description: 设置数据类型
 * @param {*} data
 * @return {*}
 */
function getWs(data,cloums) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != data.length; ++R) {
    // 行
    for (var C = 0; C != data[R].length; ++C) {
      // 列
      var cellObject = cloums[C];
      debugger
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let value = data[R][C];
      if (cellObject&&cellObject.type === "decimal" && (value === 0||value =='null'))
        value = "--";
      var cell = { v: value };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
       if (typeof cell.v === "number") cell.t = "n";
      else if (typeof cell.v === "boolean") cell.t = "b";
      else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s";  // 素有单元格都设置成文字类型
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}
export{getColWidth,excelDefault,setCellStyle,getWs}

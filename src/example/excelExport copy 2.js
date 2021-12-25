import { saveAs } from "file-saver";
import XLSX from "pikaz-xlsx-style";
import tablerow from './tablerow.json';
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
// 文件类型
const excelEnum = {
  bookType: ["xlsx", "xls"],
};
/**
     * @name:导出excel
     * @param {options}
     *     {bookType: 文件类型
     *     filename  文件名
     *     sheet  表格配置
     *     beforeStart   处理数据前
     *      beforeExport}  导出前
     * @return:
     */
    /**
 * @description: 递归获取头部所有id
 * @param {*} columns
 * @param {*} keys
 * @return {*}
 */
function getColumnsIds(columns, keys) {
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
       nodes.push(obj.field);
      }

    }
  }
  return {nodes,isColgroup};
}
function getMultiHeader() {
return []
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
export default function exportExcel(options) {
    // table: tableDatas,
    //       keys: tableColumn,
  const {
    bookType = "xlsx",
    filename = "excel",
    sheet = [],
    beforeStart = (bookType, filename, sheet) => {},
    beforeExport = (bookType, filename, blob) => {},
    onError = (err) => {},
  } = options;
  // 处理数据前
  const beforeStartFn = beforeStart(bookType, filename, sheet);
  if (beforeStartFn === false) {
    return;
  }
  if (!sheet || sheet.length <= 0) {
    onError("Table data cannot be empty");
    return;
  }
  // const wb = Workbook();
  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表头
      tHeader,
      // 表格数据
      table,
      // 合并项
      merges,
      // 数据键值
      columns,
      // 列宽
      colWidth,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle,
    } = item;
    const {nodes:keys,isColgroup}=getColumnsIds(columns)
  //  const keys = .nodes
         // 多级表头
    let multiHeader=[]
  if (isColgroup) {
    multiHeader= getMultiHeader()
  }
    //  {value: '客商名称', colspan: 1, rowspan: 2, type: 'string'}
//  let tableRows={header,body}
    let tableData = fillTableData(tableRows); // 填充后的 表格数据
 let headNum = tableRows.header.length;

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
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    }),
    `${filename}.xlsx`
  );
  //   sheetName = sheetName || excelDefault.sheetName;
  //   // 默认全局样式覆盖
  //   const dgStyle = excelDefault.globalStyle;
  //   if (globalStyle) {
  //     Object.keys(dgStyle).forEach((key) => {
  //       globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] };
  //     });
  //   } else {
  //     globalStyle = dgStyle;
  //   }
  //   // 处理标题格式
  //   if (title || title === 0 || title === "") {
  //     // 取表头、多级表头中的最大值
  //     const tHeaderLength = (tHeader && tHeader.length) || 0;
  //     const multiHeaderLength =
  //       (multiHeader && Math.max(...multiHeader.map((m) => m.length))) || 0;
  //     const titleLength = Math.max(
  //       tHeaderLength,
  //       multiHeaderLength,
  //       keys.length
  //     );
  //     // 第一个元素为title，剩余以空字符串填充
  //     title = [title].concat(Array(titleLength - 1).fill(""));
  //     // 处理标题的合并\
  //     const cell = [
  //       "A",
  //       "B",
  //       "C",
  //       "D",
  //       "E",
  //       "F",
  //       "G",
  //       "H",
  //       "I",
  //       "J",
  //       "K",
  //       "L",
  //       "M",
  //       "N",
  //       "O",
  //       "P",
  //       "Q",
  //       "R",
  //       "S",
  //       "T",
  //       "U",
  //       "V",
  //       "W",
  //       "X",
  //       "Y",
  //       "Z",
  //     ];
  //     let mergeSecond = "A1";
  //     if (titleLength > 26) {
  //       const one = parseInt(titleLength / 26);
  //       const two = titleLength % 26;
  //       mergeSecond = cell[one - 1] + cell[two - 1] + "1";
  //     } else {
  //       mergeSecond = cell[titleLength - 1] + "1";
  //     }
  //     const titleMerge = `A1:${mergeSecond}`;
  //     if (!merges) {
  //       merges = [titleMerge];
  //     } else {
  //       if (merges.indexOf(titleMerge) === -1) {
  //         merges.push(titleMerge);
  //       }
  //     }
  //   }
  //   //表头对应字段
  //   let data = table.map((v) => keys.map((j) => v[j]));
  //   // 多级表头
  //   if (multiHeader) {
  //     // 倒序循环
  //     for (let i = multiHeader.length - 1; i >= 0; i--) {
  //       data.unshift(multiHeader[i]);
  //     }
  //   }
  //   tHeader && data.unshift(tHeader);
  //   title && data.unshift(title);
  //   const ws = sheet_from_array_of_arrays(data);
  //   if (merges && merges.length > 0) {
  //     if (!ws["!merges"]) ws["!merges"] = [];
  //     merges.forEach((merge) => {
  //       ws["!merges"].push(XLSX.utils.decode_range(merge));
  //     });
  //   }
  //   // 如果没有列宽则自适应
  //   if (!colWidth) {
  //     // 基准比例，以12为标准
  //     const benchmarkRate =
  //       (globalStyle.font.sz && globalStyle.font.sz / 12) || 1;
  //     // 空字符长度
  //     const nullstr = 10 * benchmarkRate + 2;
  //     // 单个中文字符长度
  //     const chinese = 2 * benchmarkRate;
  //     // 单个非中文字符长度
  //     const nChinese = benchmarkRate;
  //     //设置worksheet每列的最大宽度,并+2调整一点列宽
  //     const sheetColWidth = data.map((row) =>
  //       row.map((val) => {
  //         //先判断是否为null/undefined
  //         if (!val) {
  //           return {
  //             wch: nullstr,
  //           };
  //         } else {
  //           const strArr = val.toString().split("");
  //           const pattern = new RegExp("[\u4E00-\u9FA5]+");
  //           let re = strArr.map((str) => {
  //             // 是否为中文
  //             if (pattern.test(str)) {
  //               return chinese;
  //             } else {
  //               return nChinese;
  //             }
  //           });
  //           re = re.reduce((total, r) => total + r, 0);
  //           return {
  //             wch: re + 2,
  //           };
  //         }
  //       })
  //     );
  //     /*以第一行为初始值*/
  //     let result = sheetColWidth[0];
  //     for (let i = 1; i < sheetColWidth.length; i++) {
  //       for (let j = 0; j < sheetColWidth[i].length; j++) {
  //         if (result[j]["wch"] < sheetColWidth[i][j]["wch"]) {
  //           result[j]["wch"] = sheetColWidth[i][j]["wch"];
  //         }
  //       }
  //     }
  //     ws["!cols"] = result;
  //   } else {
  //     ws["!cols"] = colWidth.map((i) => {
  //       return { wch: i };
  //     });
  //   }

  //   // 添加工作表
  //   wb.SheetNames.push(sheetName);
  //   wb.Sheets[sheetName] = ws;
  //   let dataInfo = wb.Sheets[wb.SheetNames[index]];

  //   //全局样式
  //   (function () {
  //     Object.keys(dataInfo).forEach((i) => {
  //       if (i == "!ref" || i == "!merges" || i == "!cols") {
  //       } else {
  //         dataInfo[i.toString()].s = globalStyle;
  //       }
  //     });
  //   })();

  //   // 单个样式
  //   (function () {
  //     if (!cellStyle || cellStyle.length <= 0) {
  //       return;
  //     }
  //     cellStyle.forEach((s) => {
  //       const { border, font, alignment, fill } = s;
  //       dataInfo[s.cell].s = {
  //         border: border === {} ? border : border || globalStyle.border,
  //         font: font || globalStyle.font,
  //         alignment: alignment || globalStyle.alignment,
  //         fill: fill || globalStyle.fill,
  //       };
  //     });
  //   })();
  // });
  // // 类型默认为xlsx
  // let bookType2 =
  //   excelEnum.bookType.filter((i) => i === bookType)[0] ||
  //   excelEnum.bookType[0];
  // writeExcel(wb, bookType2, filename, beforeExport);
}
/**
 * @name: workbook对象
 * @param {type}
 * @return:
 */
function Workbook() {
  class WB {
    constructor() {
      this.SheetNames = [];
      this.Sheets = {};
    }
  }
  return new WB();
}
/**
 * @name: 导出excel文件
 * @param {type}
 * @return:
 */
function writeExcel(wb, bookType, filename, beforeExportFn) {
  const wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary",
  });
  const blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream",
  });
  const beforeExport = beforeExportFn(blob, bookType, filename);
  if (beforeExport === false) {
    return;
  }
  saveAs(blob, `${filename}.${bookType}`);
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
 * @name: 设置数据类型
 * @param {type}
 * @return:
 */
function sheet_from_array_of_arrays(data, opts) {
  let ws = {};
  const range = {
    s: {
      c: 1000000000,
      r: 1000000000,
    },
    e: {
      c: 0,
      r: 0,
    },
  };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let cell = {
        v: data[R][C],
      };
      if (cell.v == null) continue;
      let cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R,
      });

      if (typeof cell.v === "number") cell.t = "n";
      else if (typeof cell.v === "boolean") cell.t = "b";
      else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s";

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 1000000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

/**
 * @name: 转换格式
 * @param {type}
 * @return:
 */
function s2ab(s) {
  const b = new ArrayBuffer(s.length);
  const v = new Uint8Array(b);
  for (let i = 0; i < s.length; i++) {
    v[i] = s.charCodeAt(i) & 0xff;
  }
  return b;
}

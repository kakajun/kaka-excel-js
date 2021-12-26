import { saveAs } from "file-saver";
import XLSX from "pikaz-xlsx-style";
import tableRows from '../tablerow.json';
import {excelDefault,getColWidth,getWs} from './excel-style.js';
import { getColumnsIds, getMultiHeader } from './excel-head';
import {fillTableData,getDataAndmerges} from './excel-body';
// 文件类型
const excelEnum = {
  bookType: ["xlsx", "xls"],
};
/**
     * @name:导出excel
     * @param {options}
     * @return:
     */
export default function exportExcel(options) {
    // *     bookType: 文件类型
    //  *     filename  文件名
    //  *     sheet  表格配置
    //  *     beforeStart   处理数据前
    //  *      beforeExport 导出前
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
  debugger
  const wb = Workbook();
  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表格数据
      table,
      // 数据键值
      columns,
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
//  let tableRows={header,body}
    let tableData = fillTableData(tableRows); // 填充后的 表格数据
 let headNum = tableRows.header.length;
  let cols = getColWidth(tableData[headNum - 1]); // 列宽
  let excel = getDataAndmerges(tableData); // 获取excel数据，及合并的单元格
    let ws = getWs(tableData, headNum);
    debugger
  ws["!merges"] = excel.merges;
    ws["!cols"] = cols;
     // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];
    //全局样式
    (function () {
      Object.keys(dataInfo).forEach((i) => {
        if (i == "!ref" || i == "!merges" || i == "!cols") {
        } else {
          dataInfo[i.toString()].s = globalStyle;
        }
      });
    })();

    // 单个样式
    (function () {
      if (!cellStyle || cellStyle.length <= 0) {
        return;
      }
      cellStyle.forEach((s) => {
        const { border, font, alignment, fill } = s;
        dataInfo[s.cell].s = {
          border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill,
        };
      });
    })();
  });
  // 类型默认为xlsx
  let bookType2 =
    excelEnum.bookType.filter((i) => i === bookType)[0] ||
    excelEnum.bookType[0];
  writeExcel(wb, bookType2, filename, beforeExport);
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

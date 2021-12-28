import { saveAs } from "file-saver";
import XLSX from "pikaz-xlsx-style";
import {
  excelDefault,
  getWs,
  setColWidth,
  setSingleCell,
} from "./excel-style.js";
import {
  getColumnsIds,
  setTitleMerges,
  getLevels,
  setMerges,
  setCellCode,
} from "./excel-head";

import createDebugger from 'debug'
const debug = createDebugger('index')
if (process.env==='development') {
debug.enabled = true
}
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
export default function exportExcel(options) {

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
  const wb = Workbook();
  sheet.forEach((item, index) => {

    let {
      // 标题
      title,
      // 表格数据
      table,
      // 列宽
      colWidth,
      // 合并项
      merges,
      // 列头
      columns,
      //转换单位(元)
      currencyType = 1,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle,
    } = item;
    const nodes = getColumnsIds(columns);
    const keys = nodes.map((item) => item.field||item.id);
    const tHeader = nodes.map((item) => item.title||item.text);

    // 获取最大层级
    setCellCode(columns, null, null);
    // 最大层级集合
    const allLevels = getLevels(columns, null);
    debug(`columns: ${columns}`)
    // 获取最大层级
    const maxLevel = Math.max(...allLevels);
    const setMergesObj = setMerges(columns, maxLevel, merges, title);
    // 多级表头
    let multiHeader = setMergesObj.multiHeader;
    merges = setMergesObj.merges;
    debug(`merges: ${merges}`)
    debug(`multiHeader: ${multiHeader}`)
    sheetName = sheetName || excelDefault.sheetName;
    // 默认全局样式覆盖
    const dgStyle = excelDefault.globalStyle;
    if (globalStyle) {
      Object.keys(dgStyle).forEach((key) => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] };
      });
    } else {
      globalStyle = dgStyle;
    }
    // 处理标题格式
    if (title || title === 0 || title === "") {
      // 取表头、多级表头中的最大值
      const tHeaderLength = (tHeader && tHeader.length) || 0;
      const multiHeaderLength =
        (multiHeader && Math.max(...multiHeader.map((m) => m.length))) || 0;
      const titleLength = Math.max(
        tHeaderLength,
        multiHeaderLength,
        keys.length
      );
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(""));
      // 处理标题的合并
      merges = setTitleMerges(titleLength, merges);
    }
    //表头对应字段
    let data = table.map((v) => keys.map((j) => v[j]));
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      data.unshift(...multiHeader);
    }
    title && data.unshift(title);
    let ws = getWs(data, nodes, currencyType, maxLevel + 1,title);
    if (merges && merges.length > 0) {
      if (!ws["!merges"]) ws["!merges"] = [];
      merges.forEach((merge) => {
        ws["!merges"].push(XLSX.utils.decode_range(merge));

      });
    }
    // 设置列宽
    ws["!cols"] = setColWidth(colWidth, data, globalStyle);
    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];
    // 单个样式
       setSingleCell(cellStyle, dataInfo, globalStyle);
  });
  // 类型默认为xlsx
  let bookType2 =
    excelEnum.bookType.filter((i) => i === bookType)[0] ||
    excelEnum.bookType[0];
  writeExcel(wb, bookType2, filename, beforeExport);

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

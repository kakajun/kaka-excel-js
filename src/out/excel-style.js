import XLSX from "pikaz-xlsx-style";
import createDebugger from "debug";
const debug = createDebugger("excel-style");
debug.enabled = true;
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
      horizontal:
        cellObject.type && cellObject.type === "decimal" ? "right" : "left",
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
 * @desc    : 千分位分隔    例如: currency(value,2 ,'万元' )
 * @param   {value}      要转的数值
 * @param   {currency}   后面带的货币单位
 * @param   {decimals}   小数位数
 */
function currencyF(value, decimals, currency) {
  if (!value) value = 0;
  const valuex = parseFloat(value);
  if (!isFinite(valuex) || (!valuex && valuex !== 0)) return "";
  currency = currency != null ? currency : "";
  decimals = decimals != null ? decimals : 2;
  const stringified = Math.abs(valuex).toFixed(decimals);
  const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = _int.length % 3;
  const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  const _float = decimals ? stringified.slice(-1 - decimals) : "";
  const sign = valuex < 0 ? "-" : "";
  return (
    sign +
    head +
    _int.slice(i).replace(/(\d{3})(?=\d)/g, "$1,") +
    _float +
    currency
  );
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
 * @param {*} data           数据
 * @param {*} cloums        列头
 * @param {*} currencyType   转换单位
 * @return {*}
 */
function getWs(data, cloums, currencyType, headNum,title) {
  if (title) {
        // 有标题的话,表头多一行
     headNum =headNum + 1;
  }
  var ws = {};
  const clen = cloums.length;
  const dlen = data.length;
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != dlen; ++R) {
    // 行
    for (var C = 0; C < clen; C++) {
      // 列
      var cellObject = cloums[C];
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let value = data[R][C];
      if (
        cellObject &&
        cellObject.type &&
        cellObject.type === "decimal" &&
        R > headNum - 1
      ) {
        debug(`R ${R} `);
        if (!value || value === 0 || value == "null") value = "--";
        else {
          if (cellObject.unit) {
            // 如果列头包含'%'等,直接加到后面
            value = value + cellObject.unit;
          } else {
            // 单位转换
            value = currencyF(value / currencyType);
          }
        }
      }
      var cell = { v: value };
      // 这里如果是null那么要把null置空,否则真会出现null在表格中
      if (cell.v == null) cell.v = "";
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
      // if (typeof cell.v === "number") cell.t = "n";
      if (typeof cell.v === "boolean") cell.t = "b";
      else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s"; // 素有单元格都设置成文字类型
      setCellStyle(cell, cellObject, R < headNum ? "header" : "content");
      if (R === 0&&title) {
        // 标题不要bord
        cell.s.border={}
      }
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  debug(`ws ${headNum} `);
  return ws;
}

/**
 * @description: 返回自定义列宽或者自适应
 * @param {*} colWidth       自定义的列宽
 * @param {*} data           数据
 * @param {*} globalStyle    全局样式
 * @return {*}
 */
function setColWidth(colWidth, data, globalStyle) {
  let result;
  // 如果没有列宽则自适应
  if (!colWidth) {
    // 基准比例，以12为标准
    const benchmarkRate =
      (globalStyle.font.sz && globalStyle.font.sz / 12) || 1;
    // 空字符长度
    const nullstr = 10 * benchmarkRate + 2;
    // 单个中文字符长度
    const chinese = 2 * benchmarkRate;
    // 单个非中文字符长度
    const nChinese = benchmarkRate;
    //设置worksheet每列的最大宽度,并+2调整一点列宽
    const sheetColWidth = data.map((row) =>
      row.map((val) => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            wch: nullstr,
          };
        } else {
          const strArr = val.toString().split("");
          const pattern = new RegExp("[\u4E00-\u9FA5]+");
          let re = strArr.map((str) => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese;
            } else {
              return nChinese;
            }
          });
          re = re.reduce((total, r) => total + r, 0);
          return {
            wch: re + 2,
          };
        }
      })
    );
    /*以第一行为初始值*/
    result = sheetColWidth[0];
    debug(`result:${result}`);
    for (let i = 1; i < sheetColWidth.length; i++) {
      for (let j = 0; j < sheetColWidth[i].length; j++) {
        if (result[j]["wch"] < sheetColWidth[i][j]["wch"]) {
          result[j]["wch"] = sheetColWidth[i][j]["wch"];
        }
      }
    }
  } else {
    result = colWidth.map((i) => {
      return { wch: i };
    });
  }
  return result;
}

/**
 * @description: 单个样式设置
 * @param {*} cellStyle
 * @param {*} dataInfo
 * @param {*} globalStyle
 * @return {*}
 */
function setSingleCell(cellStyle, dataInfo, globalStyle) {
  if (!cellStyle || cellStyle.length <= 0) {
    return;
  }
  for (let index = 0; index < cellStyle.length; index++) {
    const s = cellStyle[index];
    const { border, font, alignment, fill } = s;
    dataInfo[s.cell].s = {
      border: border === {} ? border : border || globalStyle.border,
      font: font || globalStyle.font,
      alignment: alignment || globalStyle.alignment,
      fill: fill || globalStyle.fill,
    };
  }
}
export { excelDefault, getWs, setColWidth, setSingleCell };

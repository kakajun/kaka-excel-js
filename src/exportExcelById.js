import FileSaver from 'file-saver'

import XLSX from 'xlsx';
/**
 * @description: 使用 正则表达式 和 replace 函数千位分隔符并强制保留两位小数
 * @param {*} num
 */
function showToFixed(num, digit = 2) {
  if (num === undefined || num === null) return ''
  if (isNaN(num)) return num //如果是文字,原路返回
  const data = Number(num)
  return data.toFixed(digit).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

const borderAll = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' }
}
export default class CommonExport {
  constructor() {
    this.excelWb = null
    this.headerStyle = {
      font: {
        ...this.fontStyle,
        // 字体样式设置 "#606266;"
        name: '宋体',
        sz: 14,
        // color: { rgb: '606266' },
        bold: true
      },
      fill: {
        // 背景颜色设置
        // fgColor: { rgb: "f0f8ff" }
      },
      alignment: {
        // 是否居中center | 左对齐left | 右对齐right
        horizontal: 'center',
        vertical: 'center'
      },
      border: { ...borderAll }
    }
    this.fontStyle = {
      name: '宋体',
      sz: 12,
      // color: { rgb: 'FF000000' },
      bold: false,
      italic: false,
      underline: false
    }
    this.alignment = {
      vertical: 'center',
      indent: 0,
      wrapText: true
    }
  }


  setAutoCloums(sheet1, id) {
    var table = document.getElementById(id)
    var rows = table.querySelectorAll('tr')
    var columns = rows[0].querySelectorAll('th')
    const data = Array.from(columns).map(item => item.innerText)
    sheet1['!cols'] = this.setColWidth(null, data)
  }
  exportExcl(tableId, sheetName, columnLength) {
      this.excelWb = XLSX.utils.book_new()
      let excelWs = XLSX.utils.table_to_sheet(
        document.getElementById(tableId),
        {
          raw: true
        }
      )
      console.log(excelWs, 'eeeee')
      this.setSheetStyle(excelWs, columnLength)
      this.setAutoCloums(excelWs, tableId)
      XLSX.utils.book_append_sheet(this.excelWb, excelWs, sheetName)
      this.doSaveExcel(sheetName)
  }
  setSheetStyle(sheet1, columnLength) {
    let colLength = 0
    if (columnLength > 0) {
      colLength = columnLength
    }
    this.addRangeBorder(sheet1['!merges'], sheet1, colLength)
    // 默认样式
    const defaultCellStyle = {
      font: this.fontStyle,
      alignment: this.alignment,
      border: { ...borderAll }
    }
    const hpx = []
    for (let i = 0; i < 200; i++) {
      hpx.push({ hpt: 30 })
    }
    sheet1['!rows'] = hpx
    // 给每个单元格的默认样式
    for (const sheet1Obj in sheet1) {
      if (sheet1Obj.indexOf('!') < 0) {
        const lineNumber = parseInt(sheet1Obj.replace(/[a-zA-Z]/g, ''))
        // const countS = sheet1Obj.replace(/[0-9]/g, '')
        const value = sheet1[sheet1Obj].v
        if (value || lineNumber > 1) {
          // 跳过表头
          sheet1[sheet1Obj].s = JSON.parse(JSON.stringify(defaultCellStyle))
          this.setAlignment(sheet1[sheet1Obj])
        }
        if (sheet1Obj.indexOf('A') >= 0) {
          sheet1[sheet1Obj].s.alignment.horizontal = 'left'
        }

        if (lineNumber == 1 && value) {
          // 列头,单独给样式
          sheet1[sheet1Obj].s = this.headerStyle
        }
      }
    }
  }
  /**
   * @description: 设置默认位置及格式化数值
   * @param {*} obj
   */
  setAlignment(obj) {
    const v = obj.v
    if (isNaN(v)) {
      obj.s.alignment.horizontal = 'left'
    } else {
      obj.s.alignment.horizontal = 'right'
      // 千分位两位小数
      obj.v = showToFixed(obj.v)
    }
  }
  addRangeBorder(range, ws, colLength) {
    const arrCase = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    const arr = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    let index = 0
    while (arr.length < colLength) {
      for (const string of arrCase) {
        arr.push(arrCase[index] + string)
      }
      index += 1
    }
    if (range != null) {
      //给合并单元的表格添加边框
      if (!range) {
        return ws
      }
      range.forEach(item => {
        let startRowNumber = Number(item.s.c)

        let endRowNumber = Number(item.e.c)
        let startLineNumber = Number(item.s.r)

        let endLineNumber = Number(item.e.r)
        for (let i = startRowNumber; i <= endRowNumber; i++) {
          for (let j = startLineNumber + 1; j <= endLineNumber + 1; j++) {
            if (!ws[arr[i] + j]) {
              ws[arr[i] + j] = {
                s: {
                  border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                  }
                }
              }
            }
          }
        }
      })
    }

    return ws
  }
  /**
   * @description: 返回自定义列宽或者自适应
   * @param {*} colWidth       自定义的列宽
   * @param {*} data           数据
   * @return {*}
   */
  setColWidth(colWidth, data) {
    const padding = 4
    let result
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = 1
      // 空字符长度
      const nullstr = 12 * benchmarkRate + padding
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            wch: nullstr
          }
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp('[\u4E00-\u9FA5]+')
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            wch: re + padding
          }
        }
      })
      result = sheetColWidth
    } else {
      result = colWidth.map(i => {
        return { wch: i }
      })
    }
    return result
  }
  doSaveExcel(sheetName) {
    const wbout = XLSX.write(this.excelWb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true,
      showGridLines: true,
      raw: true
    })
    const s2ab = function (s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      sheetName + '.xlsx'
    )
  }

}

import XEUtils from 'xe-utils'
import * as ExcelJS from 'exceljs'
const defaultHeaderBackgroundColor = 'f8f8f9'
const defaultCellFontColor = '606266'
const defaultCellBorderStyle = 'thin'
const defaultCellBorderColor = 'e8eaec'

function getCellLabel (column, cellValue) {
  if (cellValue) {
    switch (column.cellType) {
      case 'string':
        return XEUtils.toValueString(cellValue)
      case 'number':
        if (!isNaN(cellValue)) {
          return Number(cellValue)
        }
        break
      default:
        if (cellValue.length < 12 && !isNaN(cellValue)) {
          return Number(cellValue)
        }
        break
    }
  }
  return cellValue
}

function getValidColumn (column) {
  const { childNodes } = column
  const isColGroup = childNodes && childNodes.length
  if (isColGroup) {
    return getValidColumn(childNodes[0])
  }
  return column
}

function setExcelRowHeight (excelRow, height) {
  if (height) {
    excelRow.height = XEUtils.floor(height * 0.75, 12)
  }
}

function setExcelCellStyle (excelCell, align) {
  excelCell.protection = {
    locked: false
  }
  excelCell.alignment = {
    vertical: 'middle',
    horizontal: align || 'left'
  }
}

function getDefaultBorderStyle () {
  return {
    top: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    left: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    bottom: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    },
    right: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor
      }
    }
  }
}

/**
 * @description: 导出主函数
 * @param {*} params
 * @return {*}
 */
function exportXLSX (params) {
  const msgKey = 'xlsx'
  const { $table, options, columns, colgroups, datas } = params
  const { $vxe, rowHeight, headerAlign: allHeaderAlign, align: allAlign, footerAlign: allFooterAlign } = $table
  const { modal, t } = $vxe
  const { message, sheetName, isHeader, isFooter, isMerge, isColgroup, original, useStyle, sheetMethod } = options
  const showMsg = message !== false
  const mergeCells = $table.getMergeCells()
  const colList = []
  const footList = []
  const sheetCols = []
  const sheetMerges = []
  let beforeRowCount = 0
  const colHead = {}
  columns.forEach((column) => {
    const { id, property, renderWidth } = column
    colHead[id] = original ? property : column.getTitle()
    sheetCols.push({
      key: id,
      width: XEUtils.ceil(renderWidth / 8, 1)
    })
  })
  // 处理表头
  if (isHeader) {
    // 处理分组
    if (isColgroup && !original && colgroups) {
      colgroups.forEach((cols, rIndex) => {
        const groupHead= {}
        columns.forEach((column) => {
          groupHead[column.id] = null
        })
        cols.forEach((column) => {
          const { _colSpan, _rowSpan } = column
          const validColumn = getValidColumn(column)
          const columnIndex = columns.indexOf(validColumn)
          groupHead[validColumn.id] = original ? validColumn.property : column.getTitle()
          if (_colSpan > 1 || _rowSpan > 1) {
            sheetMerges.push({
              s: { r: rIndex, c: columnIndex },
              e: { r: rIndex + _rowSpan - 1, c: columnIndex + _colSpan - 1 }
            })
          }
        })
        colList.push(groupHead)
      })
    } else {
      colList.push(colHead)
    }
    beforeRowCount += colList.length
  }
  // 处理合并
  if (isMerge && !original) {
    mergeCells.forEach(mergeItem => {
      const { row: mergeRowIndex, rowspan: mergeRowspan, col: mergeColIndex, colspan: mergeColspan } = mergeItem
      sheetMerges.push({
        s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
        e: { r: mergeRowIndex + beforeRowCount + mergeRowspan - 1, c: mergeColIndex + mergeColspan - 1 }
      })
    })
  }
  const rowList = datas.map(item => {
    const rest = {}
    columns.forEach((column) => {
      rest[column.id] = getCellLabel(column, item[column.id])
    })
    return rest
  })
  beforeRowCount += rowList.length

  const exportMethod = () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet(sheetName)
    workbook.creator = 'vxe-table'
    sheet.columns = sheetCols
    if (isHeader) {
      sheet.addRows(colList).forEach(excelRow => {
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight)
        }
        excelRow.eachCell(excelCell => {
          const excelCol = sheet.getColumn(excelCell.col)
          const column  = $table.getColumnById(excelCol.key )
          const { headerAlign, align } = column
          setExcelCellStyle(excelCell, headerAlign || align || allHeaderAlign || allAlign)
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                bold: true,
                color: {
                  argb: defaultCellFontColor
                }
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                  argb: defaultHeaderBackgroundColor
                }
              },
              border: getDefaultBorderStyle()
            })
          }
        })
      })
    }
    sheet.addRows(rowList).forEach(excelRow => {
      if (useStyle) {
        setExcelRowHeight(excelRow, rowHeight)
      }
      excelRow.eachCell(excelCell => {
        const excelCol = sheet.getColumn(excelCell.col)
        const column = $table.getColumnById(excelCol.key)
        const { align } = column
        setExcelCellStyle(excelCell, align || allAlign)
        if (useStyle) {
          Object.assign(excelCell, {
            font: {
              color: {
                argb: defaultCellFontColor
              }
            },
            border: getDefaultBorderStyle()
          })
        }
      })
    })
    if (isFooter) {
      sheet.addRows(footList).forEach(excelRow => {
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight)
        }
        excelRow.eachCell(excelCell => {
          const excelCol = sheet.getColumn(excelCell.col)
          const column = $table.getColumnById(excelCol.key )
          const { footerAlign, align } = column
          setExcelCellStyle(excelCell, footerAlign || align || allFooterAlign || allAlign)
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                color: {
                  argb: defaultCellFontColor
                }
              },
              border: getDefaultBorderStyle()
            })
          }
        })
      })
    }
    if (useStyle && sheetMethod) {
      const sParams = { options: options , workbook, worksheet: sheet, columns, colgroups, datas, $table }
      sheetMethod(sParams)
    }
    sheetMerges.forEach(({ s, e }) => {
      sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1)
    })
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      // 导出 xlsx
      downloadFile(params, blob, options)
      if (showMsg && modal) {
        modal.close(msgKey)
        modal.message({ content: t('vxe.table.expSuccess') , status: 'success' })
      }
    })
  }
  if (showMsg && modal) {
    modal.message({ id: msgKey, content: t('vxe.table.expLoading'), status: 'loading', duration: -1 })
    setTimeout(exportMethod, 1500)
  } else {
    exportMethod()
  }
}

function downloadFile (params, blob, options) {
  const { $table } = params
  const { $vxe } = $table
  const { modal, t } = $vxe
  const { message, filename, type } = options
  const showMsg = message !== false
  if (window.Blob) {
    if ((navigator ).msSaveBlob) {
      (navigator).msSaveBlob(blob, `${filename}.${type}`)
    } else {
      const linkElem = document.createElement('a')
      linkElem.target = '_blank'
      linkElem.download = `${filename}.${type}`
      linkElem.href = URL.createObjectURL(blob)
      document.body.appendChild(linkElem)
      linkElem.click()
      document.body.removeChild(linkElem)
    }
  } else {
    if (showMsg && modal) {
      modal.alert({ content: t('vxe.error.notExp') , status: 'error' })
    }
  }
}

function handleExportEvent (params) {
  if (params.options.type === 'xlsx') {
    exportXLSX(params)
    return false
  }
}

/**
 * 基于 vxe-table 表格的增强插件，支持导出 xlsx 格式
 */
export const VXETablePluginExportXLSX = {
  install (vxetable) {
    const { interceptor } = vxetable
    vxetable.setup({
      export: {
        types: {
          xlsx: 0
        }
      }
    })
    interceptor.mixin({
      'event.export': handleExportEvent
    })
  }
}

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginExportXLSX)
}

export default VXETablePluginExportXLSX
